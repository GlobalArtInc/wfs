import { PlayerRepository, PlayerStatRepository } from '@app/dal/repositories/player';
import { PlayerTypeEnum } from '@app/dal/repositories/player/player.enums';
import { WarfaceApiPlayerData, WarfaceApiSavePlayerData } from '@app/infrastructure/apis/warface/warface-api.types';
import { WarfaceApiService } from '@app/infrastructure/apis/warface/warface.api.service';
import { WfStatsCfApiService } from '@app/infrastructure/apis/wfstats-cf/wfstats-cf.api.service';
import { HelpersService } from '@app/shared/modules/helpers/helpers.service';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetPlayerAchievementsDto } from './dtos';
import * as moment from 'moment';
import { RedisService } from '@app/shared/modules/redis-microservice/redis.service';
import { omit } from 'lodash';

@Injectable()
export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly playerStatRepository: PlayerStatRepository,
    private readonly warfaceApiService: WarfaceApiService,
    private readonly wfStatsApiService: WfStatsCfApiService,
    private readonly helpersService: HelpersService,
    private readonly redisService: RedisService,
  ) {}

  async getByName(nickname: string) {
    if (!nickname) {
      throw new NotFoundException({
        code: 'player_not_found',
        message: `Игрок «${nickname}» не найден`,
      });
    }

    const savedPlayer = await this.get(nickname);
    const cachedPlayer = savedPlayer ? await this.redisService.get(savedPlayer.player.id) : null;
    const timestamp = moment().toDate();
    
    if (savedPlayer && cachedPlayer) {
      const parsedPlayer = JSON.parse(cachedPlayer);
      const { server, state, player, fullPlayer, achievements } = parsedPlayer;
      const isOnline = await this.checkOnlineStatus(nickname, server);
      return this.formatPlayer({ server, state: { ...state, isOnline }, player, fullPlayer, achievements });
    }
    
    const servers = this.determineServers(savedPlayer);
    for (const server of servers) {
      const player = await this.warfaceApiService.getStats(server, nickname);
      if (player?.user_id) {
        const playerId = savedPlayer?.player?.id || this.helpersService.generateUUID();
        const achievements = await this.warfaceApiService.getAchievements(server, nickname);
        const fullPlayer = this.parseFullResponse(player.full_response);
        delete player.full_response;
        
        await this.redisService.set(playerId, JSON.stringify({ playerId, server, player, fullPlayer, achievements }), 120);
      
        this.saveData({ playerId, server, player, fullPlayer, achievements });

        return this.formatPlayer({
          server,
          state: { type: 'open', updatedAt: timestamp, isOnline: false },
          player,
          fullPlayer,
          achievements,
        });
      }

      const fallbackResponse = await this.handlePlayerError(player, nickname, server, servers);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
  }

  private determineServers(savedPlayer: any) {
    if (savedPlayer) {
      return [savedPlayer.server, ...(savedPlayer.server === 'ru' ? ['int'] : ['ru'])];
    }
    return ['ru', 'int'];
  }

  private async checkOnlineStatus(nickname: string, server: string) {
    try {
      const onlineInfoRes = await this.wfStatsApiService.getPlayerInfo(nickname, server);
      return !!onlineInfoRes;
    } catch {
      return false;
    }
  }

  private async handlePlayerError(player: any, nickname: string, server: string, servers: string[]) {
    const user = await this.get(nickname);
    const isLastServer = server === servers[servers.length - 1];

    if (!user) {
      if (player.message === 'Ошибка: invalid response status') {
        throw new InternalServerErrorException({ code: 'maintenance', message: `Сервер WF API недоступен.` });
      }
      if (player.message === 'Персонаж неактивен') {
        throw new ForbiddenException({
          code: 'inactive',
          message: `Игрок «${nickname}» неактивен. Мы не сможем вывести его статистику.`,
        });
      }
      if (player.message === 'Игрок скрыл свою статистику') {
        throw new ForbiddenException({
          code: 'hidden',
          message: `Игрок «${nickname}» скрыл свою статистику. Мы не сможем вывести его статистику.`,
        });
      }
      if (player.message === 'Пользователь не найден' && isLastServer) {
        throw new NotFoundException({ code: 'player_not_found', message: `Игрок «${nickname}» не найден` });
      }
    }
    if (!player && isLastServer) {
      throw new NotFoundException({ code: 'player_not_found', message: `Игрок «${nickname}» не найден` });
    }

    if (user) {
      const { server: savedServer, state, player: savedPlayer, fullPlayer, achievements } = user;
      return this.formatPlayer({
        server: savedServer,
        state: { type: player.message, updatedAt: state.updatedAt, isOnline: false },
        player: savedPlayer,
        fullPlayer,
        achievements,
      });
    }
  }

  async getInfoFromOnlinePlayer(nickname: string) {
    const playerInfo = await this.get(nickname);
    const { server, state, player } = playerInfo;
    const onlineInfo = await this.wfStatsApiService.getPlayerInfo(nickname, server);

    return { server, state, player, onlineInfo };
  }

  async getPlayerAchievements(nickname: string, dto: GetPlayerAchievementsDto) {
    const player = await this.get(nickname);
    const { server, state, achievements } = player;
    const { progress } = dto;

    if (progress) {
      const achievement = achievements.find((item) => item.achievement_id === progress);
      if (achievement) {
        return { server, nickname, achievement };
      }
    }
    return { server, state, achievements };
  }

  async getMissions(nickname: string) {
    const player = await this.get(nickname);
    return this.formatMissions(player);
  }

  async get(nickname: string) {
    const player = await this.playerRepository.getOneBy({ nickname }, { relations: { playerAchievements: true } });
    if (player) {
      const { server, type, updated_at } = player;
      const state = { type, updatedAt: updated_at };
      const fullPlayerRes = await this.playerStatRepository.getManyBy({ playerId: player.id });
      const fullPlayer = this.responseToObject(
        fullPlayerRes.reduce(
          (acc, item) => ({ ...acc, [item.param]: isNaN(item.value) ? String(item.value) : Number(item.value) }),
          {},
        ),
      );
      return { server, state, player, fullPlayer, achievements: player.playerAchievements };
    }
    return null;
  }

  private async saveData(data: WarfaceApiSavePlayerData) {
    const params = Object.entries(data.player).reduce((acc: any, [key, value]) => {
      if (!['full_response', 'is_transparent'].includes(key)) acc[key] = value ?? 0;
      return acc;
    }, {});

    this.playerRepository.upsert({
      id: data.playerId,
      type: PlayerTypeEnum.Open,
      server: data.server,
      ...params,
      playerStats: Object.entries(data.fullPlayer).map(([param, value]) => ({ playerId: data.playerId, param, value })),
      playerAchievements: data.achievements.map(({ achievement_id, progress, completion_time }) => ({
        playerId: data.playerId,
        achievement_id,
        progress,
        completion_time,
      })),
    });
  }

  private formatPlayer(playerData: WarfaceApiPlayerData) {
    const { server, state, player, fullPlayer, achievements } = playerData;
    return {
      server,
      state: { type: state.type, updatedAt: state.updatedAt, isOnline: state?.isOnline || false },
      player: omit(player, ['playerAchievements']),
      fullPlayer: this.responseToObject(fullPlayer),
      achievements: achievements.map((achievement) => omit(achievement, ['playerId'])),
    };
  }

  private extractFullResponseMatch(el: string, regexp: RegExp) {
    return el.match(regexp)[0].trim();
  }

  private responseToObject(object: any) {
    return Object.entries(object).reduce((acc: any, [key, value]) => {
      const keys = key
        .split(/\[(.+?)\]/)
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
      const last = keys.pop();
      keys.reduce((sub, key) => sub[key] ?? (sub[key] = {}), acc)[last] = value;
      return acc;
    }, {});
  }

  private parseFullResponse(fullResponse: string) {
    if (!fullResponse) return [];
    return fullResponse.split(/<Sum>|<Max>/).reduce((acc: any, el) => {
      if (!el) return acc;
      const key = this.extractFullResponseMatch(el, /.*(?=\=)/).replace(/\([^()]*\)/g, '');
      acc[key] = +this.extractFullResponseMatch(el, /(?<=\=).*/);
      return acc;
    }, {});
  }

  private formatMissions(playerData: any) {
    const missions = {};
    return {
      nickname: playerData.player.nickname,
      rank_id: playerData.player.rank_id,
      server: playerData.server,
      state: { type: playerData.state.type, updatedAt: playerData.state.updatedAt },
      missions,
    };
  }
}
