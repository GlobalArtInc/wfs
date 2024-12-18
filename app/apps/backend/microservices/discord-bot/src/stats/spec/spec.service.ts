import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { NestcordService } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { APIEmbedField, Colors } from 'discord.js';
import * as moment from 'moment';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { HelpersService } from '../../helpers/helpers.service';
import { SettingService } from '../../setting/setting.service';
import { TranslationService } from '../../translation/translation.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class SpecService {
  constructor(
    private readonly userService: UserService,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly settingService: SettingService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly nestcordService: NestcordService,
    private translationService: TranslationService,
  ) {}

  public async createEmbed({ discordUserId, name }: { discordUserId: string; name: string }) {
    const playerName = name || (await this.userService.getLinkedPlayer(discordUserId));
    if (!playerName) {
      throw new DiscordErrorException('app.errors.player_name_not_specified');
    }

    const missionsData = await this.settingService.getValueByKey('missions_stats');
    const playerInfo = await this.internalBotApiService.send<PlayerInfo>('get', `player`, {
      name: playerName,
    });

    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Green,
      footer: {
        text: playerInfo.state.errorStatus
          ? this.translationService.get(`app.errors.player.status.${playerInfo.state.status}`, {
              name: playerInfo.player.nickname,
              updatedAt: moment(playerInfo.state.updatedAt).format('DD.MM.YYYY hh:mm (GMT)'),
            })
          : undefined,
      },
    });

    embed
      .setThumbnail(this.nestcordService.getApplicationAsset('common')?.url)
      .setAuthor(this.createAuthorObject(playerInfo));

    const fields: APIEmbedField[] = Object.keys(missionsData).map((item) => {
      const mission = missionsData[item];
      const stats = this.getMissionStats(mission, playerInfo);

      return {
        name: `${this.nestcordService.getApplicationEmojiPlain(`wfs_${item}`)} **${this.translationService.get(`app.${mission.name}`)}**`,
        value: stats.join('\n'),
        inline: true,
      };
    });

    embed.addFields(fields);

    return embed;
  }

  private getMissionStats(mission: any, playerInfo: PlayerInfo): string[] {
    return Object.keys(mission.mode).map((itemKey) => {
      const stat = mission.mode[itemKey];
      let { won, lost } = this.getPlayerStats(stat, playerInfo);
      const statsData = {
        won,
        lost,
      };

      if (mission.survivalMode && stat.category === 'hard') {
        const survivalStats = this.getSurvivalStats(mission, playerInfo);
        statsData.won = +won + +survivalStats.won;
        statsData.lost = +lost + +survivalStats.lost;
      }

      if (stat.category === 'survival') {
        return `${this.translationService.get('app.labels.done', { count: HelpersService.numeral(statsData.won) })}\r\n${this.translationService.get('app.labels.failed', { count: HelpersService.numeral(statsData.lost) })}`;
      }

      return `${this.translationService.get(`app.${stat.name}`)}: ${HelpersService.numeral(statsData.won)} / ${HelpersService.numeral(statsData.lost)}`;
    });
  }

  private getPlayerStats(stat: any, playerInfo: PlayerInfo): { won: number; lost: number } {
    const complexity = playerInfo.fullPlayer?.complexity?.[stat.category]?.mission_type?.[stat.code];
    let totalWon = 0;
    let totalLost = 0;

    if (complexity?.mode?.pve?.season) {
      Object.values(complexity.mode.pve.season).forEach((seasonData: any) => {
        totalWon += seasonData?.stat?.player_sessions_won || seasonData?.player_sessions_won || 0;
        totalLost += seasonData?.stat?.player_sessions_lost || seasonData?.player_sessions_lost || 0;
      });
    }

    return {
      won: totalWon,
      lost: totalLost,
    };
  }

  private getSurvivalStats(mission: any, playerInfo: PlayerInfo): { won: number; lost: number } {
    const survivalStats = playerInfo.fullPlayer?.complexity?.survival?.mission_type?.[mission.survivalMode];

    return {
      won: Number(survivalStats?.mode?.pve?.season?.stat?.player_sessions_won) || 0,
      lost: Number(survivalStats?.mode?.pve?.season?.stat?.player_sessions_lost) || 0,
    };
  }

  private createAuthorObject(playerInfo: PlayerInfo): { name: string; url: string; iconURL: string } {
    return {
      name: `[${playerInfo.server.toUpperCase()}] ${playerInfo.player.nickname} (${playerInfo.player.rankId})`,
      url: `https://wfts.su/profile/${playerInfo.player.nickname}`,
      iconURL: this.nestcordService.getApplicationEmoji(`wfs_rank_${playerInfo.player.rankId}`)?.imageURL() || '',
    };
  }
}
