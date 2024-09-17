import { NestcordService } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { APIEmbedField, Colors } from 'discord.js';
import { HelpersService } from '../../helpers/helpers.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { SettingService } from '../../setting/setting.service';
import { TranslationService } from '../../translation/translation.service';
import * as moment from 'moment';

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
      const stats = Object.keys(mission.mode).map((itemKey) => {
        const stat = mission.mode[itemKey];
        const complexity = playerInfo.fullPlayer?.complexity?.[stat.category]?.mission_type?.[stat.code];
        let won = HelpersService.numeral(complexity?.mode?.pve?.season?.stat?.player_sessions_won || 0);
        let lost = HelpersService.numeral(complexity?.mode?.pve?.season?.stat?.player_sessions_lost || 0);
        if (mission.survivalMode && stat.category === 'hard') {
          const survivalStats = playerInfo.fullPlayer?.complexity?.survival?.mission_type?.[mission.survivalMode];
          const survivalWon = HelpersService.numeral(survivalStats?.mode?.pve?.season?.stat?.player_sessions_won || 0);
          const survivalLost = HelpersService.numeral(
            survivalStats?.mode?.pve?.season?.stat?.player_sessions_lost || 0,
          );

          const totalWon = +won + +survivalWon;
          const totalLost = +lost + +survivalLost;

          won = totalWon.toString();
          lost = totalLost.toString();
        }

        if (stat.category === 'survival') {
          return `${this.translationService.get('app.labels.done', { count: won })}\r\n${this.translationService.get('app.labels.failed', { count: lost })}`;
        }
        return `${this.translationService.get(`app.${stat.name}`)}: ${won} / ${lost}`;
      });

      return {
        name: `${this.nestcordService.getApplicationEmojiPlain(`wfs_${item}`)} **${this.translationService.get(`app.${mission.name}`)}**`,
        value: stats.join('\n'),
        inline: true,
      };
    });

    embed.addFields(fields);

    return embed;
  }

  private createAuthorObject(playerInfo: PlayerInfo): { name: string; url: string; iconURL: string } {
    return {
      name: `[${playerInfo.server.toUpperCase()}] ${playerInfo.player.nickname} (${playerInfo.player.rank_id})`,
      url: `https://wfts.su/profile/${playerInfo.player.nickname}`,
      iconURL: this.nestcordService.getApplicationEmoji(`wfs_rank_${playerInfo.player.rank_id}`)?.imageURL() || '',
    };
  }
}
