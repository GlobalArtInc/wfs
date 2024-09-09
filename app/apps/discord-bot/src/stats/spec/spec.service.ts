import { NestcordService, TranslationFn } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { APIEmbedField, Colors, EmbedBuilder } from 'discord.js';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { HelpersService } from '../../helpers/helpers.service';
import { SettingService } from 'apps/discord-bot/src/setting/setting.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';
import { PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';

@Injectable()
export class SpecService {
  constructor(
    private readonly userService: UserService,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly settingService: SettingService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly nestcordService: NestcordService,
  ) {}

  public async embed({ discordUserId, name, trans }: { discordUserId: string; name: string; trans: TranslationFn }) {
    const playerName = name || (await this.userService.getLinkedPlayer(discordUserId));
    if (!playerName) {
      throw new DiscordErrorException('app.errors.player_name_not_specified');
    }

    const missionsData = await this.settingService.getValueByKey('missions_stats');

    const playerInfo = await this.internalBotApiService.send<PlayerInfo>('get', `player/${playerName}`);
    const { server, player, full_player, state } = playerInfo;
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Green,
    });

    embed
      .setThumbnail('https://wf.cdn.gmru.net/wiki/images/4/4f/Homepage7.jpg')
      .setAuthor({
        name: this.getPlayerAuthor(player.nickname, player.rank_id, server),
        url: `https://wfts.su/profile/${player.nickname}`,
        iconURL: `https://s3.globalart.dev/api/s3/wfs/ranks/Rank${player.rank_id}.png`,
      })
      .setDescription(state.isOnline ? trans('app.labels.userIsOnline') : trans('app.labels.userIsOffline'));

    const fields: APIEmbedField[] = Object.keys(missionsData).map((item) => {
      const mission = missionsData[item];
      const stats = Object.keys(mission.mode).map((itemKey) => {
        const stat = mission.mode[itemKey];
        const complexity = full_player?.complexity?.[stat.category]?.mission_type?.[stat.code];
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

  private getPlayerAuthor(nickname: string, rankId: number, server: string): string {
    return `[${server.toUpperCase()}] ${nickname} (${rankId})`;
  }
}
