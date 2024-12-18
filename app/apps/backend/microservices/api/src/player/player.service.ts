import { PlayerRepository, PlayerStatRepository } from '@app/dal/repositories/player';
import { PlayerTypeEnum } from '@app/dal/repositories/player/player.enums';
import { WarfaceApiPlayerData, WarfaceApiSavePlayerData } from '@app/infrastructure/apis/warface/warface-api.types';
import { WarfaceApiService } from '@app/infrastructure/apis/warface/warface.api.service';
import { REDIS_PROVIDER } from '@app/shared/configs/redis-microservice.config';
import { PLAYER_SAVE_REDIS_COMMAND, PLAYER_UPDATE_STATUS_COMMAND } from '@app/shared/constants';
import { HelpersService } from '@app/shared/modules/helpers/helpers.service';
import { RedisCacheService } from '@app/shared/modules/redis-microservice/redis.service';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { omit } from 'lodash';
import * as moment from 'moment';
import { ILike, In, Not } from 'typeorm';
import { GetPlayerAchievementsDto } from './dtos';

@Injectable()
export class PlayerService {
  constructor(
    @Inject(REDIS_PROVIDER)
    private readonly redisProxy: ClientProxy,
    private readonly playerRepository: PlayerRepository,
    private readonly playerStatRepository: PlayerStatRepository,
    private readonly warfaceApiService: WarfaceApiService,
    private readonly helpersService: HelpersService,
    private readonly redisService: RedisCacheService,
  ) {}
  private readonly defaultCacheTime = 120;
  private ERORR_STATUSES = [PlayerTypeEnum.Hidden, PlayerTypeEnum.Inactive, PlayerTypeEnum.NicknameChanged];

  async getByName(nickname: string) {
    if (!nickname) {
      throw new NotFoundException({
        code: 'player_not_found',
        message: `Игрок «${nickname}» не найден`,
      });
    }
    const savedPlayer = await this.get(nickname);
    const cachedPlayer = savedPlayer ? await this.redisService.get<WarfaceApiPlayerData>(savedPlayer.player.id) : null;

    if (savedPlayer && cachedPlayer) {
      return this.formatCachedPlayer(cachedPlayer);
    }

    return this.fetchAndCachePlayer(savedPlayer, nickname);
  }

  async getAllNicknames(nickname: string) {
    return this.playerRepository.getManyBy(
      {
        nickname: ILike(`%${nickname}%`),
        server: 'ru',
        type: Not(In([PlayerTypeEnum.NicknameChanged])),
      },
      {
        select: { id: true, server: true, nickname: true },
        order: { updatedAt: 'desc' },
        cache: 60000,
        take: 100,
      },
    );
  }

  private async formatCachedPlayer(cachedPlayer: WarfaceApiPlayerData) {
    const { server, state, player, fullPlayer, achievements } = cachedPlayer;

    return this.formatPlayer({ server, state: { ...state }, player, fullPlayer, achievements });
  }

  private async fetchAndCachePlayer(savedPlayer: any, nickname: string) {
    const servers = this.determineServers(savedPlayer);
    const timestamp = moment().toDate();

    for (const server of servers) {
      const playerData = await this.warfaceApiService.getStats(server, nickname);

      if (playerData?.user_id) {
        return this.handlePlayerFound(savedPlayer, playerData, server, nickname, timestamp);
      }

      const fallbackResponse = await this.handlePlayerError(playerData, nickname, server, servers);
      if (fallbackResponse) {
        await this.redisService.set(savedPlayer.player.id, fallbackResponse, this.defaultCacheTime);

        if (
          [PlayerTypeEnum.Hidden, PlayerTypeEnum.Inactive, PlayerTypeEnum.NicknameChanged].includes(
            fallbackResponse.state.status,
          )
        ) {
          this.redisProxy.emit(PLAYER_UPDATE_STATUS_COMMAND, {
            playerId: fallbackResponse.player.id,
            status: fallbackResponse.state.status,
          });
        }

        return fallbackResponse;
      }
    }
  }

  private async handlePlayerFound(
    savedPlayer: any,
    playerData: any,
    server: string,
    nickname: string,
    timestamp: Date,
  ) {
    const playerId = savedPlayer?.player?.id || this.helpersService.generateUUID();
    const achievements = await this.warfaceApiService.getAchievements(server, nickname);
    const fullPlayer = this.parseFullResponse(playerData.full_response);
    delete playerData.full_response;
    const state = { status: 'open', updatedAt: timestamp };
    const cachedData = {
      playerId,
      state,
      server,
      player: this.formatPlayerFromApi(playerData),
      fullPlayer,
      achievements,
    };

    this.redisProxy.emit(PLAYER_SAVE_REDIS_COMMAND, cachedData);
    await this.redisService.set(playerId, cachedData, this.defaultCacheTime);

    return this.formatPlayer({
      server,
      state,
      player: this.formatPlayerFromApi(playerData),
      fullPlayer,
      achievements,
    });
  }

  private formatPlayerFromApi(playerData: any) {
    return {
      userId: playerData.user_id,
      nickname: playerData.nickname,
      experience: playerData.experience,
      rankId: playerData.rank_id,
      clanId: playerData.clan_id,
      clanName: playerData.clan_name,
      kill: playerData.kill,
      friendlyKills: playerData.friendly_kills,
      kills: playerData.kills,
      death: playerData.death,
      pvp: playerData.pvp,
      pveKill: playerData.pve_kill,
      pveFriendlyKills: playerData.pve_friendly_kills,
      pveKills: playerData.pve_kills,
      pveDeath: playerData.pve_death,
      pve: playerData.pve,
      playtime: playerData.playtime,
      playtimeH: playerData.playtime_h,
      playtimeM: playerData.playtime_m,
      favoritPve: playerData.favoritPVE,
      favoritPvp: playerData.favoritPVP,
      pveWins: playerData.pve_wins,
      pvpWins: playerData.pvp_wins,
      pveLost: playerData.pve_lost,
      pvpLost: playerData.pvp_lost,
      pveAll: playerData.pve_all,
      pvpAll: playerData.pvp_all,
      pvpwl: playerData.pvpwl,
    };
  }

  private determineServers(savedPlayer: any) {
    if (savedPlayer) {
      return [savedPlayer.server, ...(savedPlayer.server === 'ru' ? ['int'] : ['ru'])];
    }
    return ['ru', 'int'];
  }

  private async handlePlayerError(player: any, nickname: string, server: string, servers: string[]) {
    const user = await this.get(nickname);
    const isLastServer = server === servers[servers.length - 1];

    let errorCode: string | undefined;
    let errorMessage: any;

    if (player?.message === 'Ошибка: invalid response status') {
      errorCode = 'maintenance';
      errorMessage = new InternalServerErrorException({ code: errorCode, message: `Сервер WF API недоступен.` });
    }
    if (player?.message === 'Персонаж неактивен') {
      errorCode = 'inactive';
      errorMessage = new ForbiddenException({
        code: errorCode,
        message: `Игрок «${nickname}» неактивен. Мы не сможем вывести его статистику.`,
      });
    }
    if (player?.message === 'Игрок скрыл свою статистику') {
      errorCode = 'hidden';
      errorMessage = new ForbiddenException({
        code: errorCode,
        message: `Игрок «${nickname}» скрыл свою статистику. Мы не сможем вывести его статистику.`,
      });
    }
    if (player?.message === 'Пользователь не найден' && isLastServer) {
      errorCode = 'player_not_found';
      errorMessage = new NotFoundException({ code: errorCode, message: `Игрок «${nickname}» не найден` });
    }
    if (!player && isLastServer) {
      errorCode = 'player_not_found';
      errorMessage = new NotFoundException({ code: errorCode, message: `Игрок «${nickname}» не найден` });
    }

    if (user && player?.message === 'Пользователь не найден') {
      errorCode = 'nickname_changed';
    }

    if (!user && errorMessage) {
      throw errorMessage;
    }
    if (user) {
      const { server: savedServer, state, player: savedPlayer, fullPlayer, achievements } = user;
      return this.formatPlayer({
        server: savedServer,
        state: { status: errorCode || 'internalServerError', updatedAt: state.updatedAt },
        player: savedPlayer,
        fullPlayer,
        achievements,
      });
    }
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
    const player = await this.playerRepository.getOneBy(
      { nickname: ILike(nickname) },
      { relations: { playerAchievements: true } },
    );

    if (player) {
      const { server, type, updatedAt } = player;
      const state = { type, updatedAt: updatedAt };
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

  public async saveData(data: WarfaceApiSavePlayerData) {
    const params = Object.entries(data.player).reduce((acc: any, [key, value]) => {
      if (!['full_response', 'is_transparent'].includes(key)) acc[key] = value ?? 0;
      return acc;
    }, {});

    this.playerRepository.upsert({
      id: data.playerId,
      type: PlayerTypeEnum.Open,
      server: data.server,
      updated_at: moment().toDate(),
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
      state: {
        status: state.status as PlayerTypeEnum,
        errorStatus: this.ERORR_STATUSES.includes(state.status as PlayerTypeEnum),
        updatedAt: state.updatedAt,
      },
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
      const key = this.extractFullResponseMatch(el, /.*(?=\=)/)
        .replace(/\([^()]*\)/g, '')
        .trim();
      acc[key] = +this.extractFullResponseMatch(el, /(?<=\=).*/);
      return acc;
    }, {});
  }

  private formatMissions(playerData: any) {
    const missions = {};
    return {
      nickname: playerData.player.nickname,
      rank_id: playerData.player.rankId,
      server: playerData.server,
      state: { type: playerData.state.type, updatedAt: playerData.state.updatedAt },
      missions,
    };
  }
}
