import { NestcordService, TranslationFn } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { APIEmbedField, Colors, EmbedBuilder } from 'discord.js';
import { HelpersService } from '../../helpers/helpers.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { SettingService } from '../../setting/setting.service';

@Injectable()
export class SpecService {
  constructor(
    private readonly userService: UserService,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly settingService: SettingService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly nestcordService: NestcordService,
  ) {}

  public async createEmbed({
    discordUserId,
    name,
    trans,
  }: {
    discordUserId: string;
    name: string;
    trans: TranslationFn;
  }) {
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
    });

    embed
      .setThumbnail('https://wf.cdn.gmru.net/wiki/images/4/4f/Homepage7.jpg')
      .setAuthor(this.createAuthorObject(playerInfo));

    const fields: APIEmbedField[] = Object.keys(missionsData).map((item) => {
      const mission = missionsData[item];
      const stats = Object.keys(mission.mode).map((itemKey) => {
        const stat = mission.mode[itemKey];
        const complexity = playerInfo.fullPlayer?.complexity?.[stat.category]?.mission_type?.[stat.code];
        const won = HelpersService.numeral(complexity?.mode?.pve?.season?.stat?.player_sessions_won || 0);
        const lost = HelpersService.numeral(complexity?.mode?.pve?.season?.stat?.player_sessions_lost || 0);

        if (stat.category === 'survival') {
          return `${trans('app.labels.done', { count: won })}\r\n${trans('app.labels.failed', { count: lost })}`;
        }
        return `${trans(`app.${stat.name}`)}: ${won} / ${lost}`;
      });

      return {
        name: `${this.nestcordService.getApplicationEmojiPlain(`wfs_${item}`)} **${trans(`app.${mission.name}`)}**`,
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
