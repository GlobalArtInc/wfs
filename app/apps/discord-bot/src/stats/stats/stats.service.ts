import { DefaultLocalizationAdapter, LOCALIZATION_ADAPTER, NestcordService, PageBuilder, TranslationFn } from '@globalart/nestcord';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { APIEmbedField, ButtonStyle, CacheType, ChatInputCommandInteraction, Colors } from 'discord.js';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { HelpersService } from '../../helpers/helpers.service';
import { SettingService } from '../../setting/setting.service';

@Injectable()
export class StatsService {
  constructor(
    @Inject(LOCALIZATION_ADAPTER)
    private readonly localizationAdapter: DefaultLocalizationAdapter,
    private readonly userService: UserService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly requestClsService: RequestClsService,
    private readonly settingService: SettingService,
    private readonly nestcordService: NestcordService,
  ) {}

  public setButtons(interaction: ChatInputCommandInteraction<CacheType>, name: string) {
    return [
      [
        {
          customId: 'pve',
          label: 'PVE',
          emoji: this.nestcordService.emojis.get('wfs_pve')?.toString(),
          style: ButtonStyle.Secondary,
          options: name,
        },
        {
          customId: 'pvp',
          label: 'PVP',
          emoji: this.nestcordService.emojis.get('wfs_pvp')?.toString(),
          style: ButtonStyle.Secondary,
          options: name,
        },
        {
          customId: 'other',
          label: 'Other',
          emoji: this.nestcordService.emojis.get('wfs_award')?.toString(),
          style: ButtonStyle.Secondary,
          options: name,
        },
      ],
    ];
  }

  async getStatsAndGetEmbed(name: string, trans: TranslationFn) {
    const discordUser = this.requestClsService.getUser();
    const playerName = name || (await this.userService.getLinkedPlayer(discordUser.id));
    const playerInfo = await this.internalBotApiService.send<PlayerInfo>('get', `player/${playerName}`);

    const [pveEmbed, pvpEmbed, otherEmbed] = await Promise.all([
      this.discordHelpersService.buildEmbed({ color: Colors.Blue }),
      this.discordHelpersService.buildEmbed({ color: Colors.Blue }),
      this.discordHelpersService.buildEmbed({ color: Colors.Blue }),
    ]);
    const commonFields: APIEmbedField[] = this.createCommonFields(playerInfo, trans);

    const author = {
      name: this.getPlayerAuthor(playerInfo.player.nickname, playerInfo.player.rank_id, playerInfo.server),
      url: `https://wfts.su/profile/${playerInfo.player.nickname}`,
      iconURL: `https://s3.globalart.dev/api/s3/wfs/ranks/Rank${playerInfo.player.rank_id}.png`,
    };

    pveEmbed.setAuthor(author).setFields(...commonFields, ...this.createPveFields(playerInfo, trans));
    pvpEmbed.setAuthor(author).setFields(...commonFields, ...this.createPvpFields(playerInfo, trans));
    otherEmbed.setAuthor(author).setFields(...commonFields, ...this.createOtherFields(playerInfo.achievements, trans));

    return [
      new PageBuilder().setEmbeds([pveEmbed]),
      new PageBuilder().setEmbeds([pvpEmbed]),
      new PageBuilder().setEmbeds([otherEmbed]),
    ];
  }

  private createCommonFields(playerInfo: PlayerInfo, trans: TranslationFn): APIEmbedField[] {
    return [
      {
        name: trans('app.stats.clan'),
        value: playerInfo.player.clan_name || 'no',
        inline: true,
      },
      {
        name: trans('app.stats.time_in_game.name'),
        value: trans('app.stats.time_in_game.value', {
          hours: playerInfo.player.playtime_h,
          minutes: playerInfo.player.playtime_m,
        }),
        inline: true,
      },
      {
        name: trans('app.stats.experience'),
        value: HelpersService.numeral(playerInfo.player.experience),
        inline: true,
      },
    ];
  }

  private createPveFields(playerInfo: PlayerInfo, trans: TranslationFn): APIEmbedField[] {
    const totalGames = Number(playerInfo.player.pve_wins || 0) + Number(playerInfo.player.pve_lost || 0);

    const classFields = ['rifleman', 'medic', 'engineer', 'recon', 'heavy'].map((className) => ({
      name: trans(`app.stats.pve.${className}.name`, { emoji: this.nestcordService.emojis.get(`wfs_${className}`)?.toString() }),
      value: trans(`app.stats.pve.${className}.value`, {
        total: trans('app.stats.hours', {
          hours: String(
            HelpersService.secToHours(
              playerInfo.full_player?.class?.[className]?.mode?.pve?.season?.stat?.player_playtime,
            ) || 0,
          ),
        }),
        shots: HelpersService.numeral(
          playerInfo.full_player?.class?.[className]?.mode?.pve?.season?.stat?.player_shots || 0,
        ),
        hits: HelpersService.numeral(
          playerInfo.full_player?.class?.[className]?.mode?.pve?.season?.stat?.player_hits || 0,
        ),
        heads: HelpersService.numeral(
          playerInfo.full_player?.class?.[className]?.mode?.pve?.season?.stat?.player_headshots || 0,
        ),
      }),
      inline: true,
    }));

    return [
      {
        name: `${this.nestcordService.emojis.get('wfs_pve')?.toString()} PVE`,
        value: `**${trans('app.stats.favoriteClass')}:** ${playerInfo.player.favoritPVE}\n**${trans(
          'app.stats.kd',
        )}:** ${playerInfo.player.pve || 0}`,
      },
      {
        name: trans('app.stats.kills'),
        value: HelpersService.numeral(playerInfo.full_player?.class?.mode?.pve?.season?.stat?.player_kills_ai || 0),
        inline: true,
      },
      {
        name: trans('app.stats.friendly_kills'),
        value: HelpersService.numeral(
          playerInfo.full_player?.class?.mode?.pve?.season?.stat?.player_kills_player_friendly || 0,
        ),
        inline: true,
      },
      {
        name: trans('app.stats.deaths'),
        value: HelpersService.numeral(playerInfo.full_player?.class?.mode?.pve?.season?.stat?.player_deaths || 0),
        inline: true,
      },
      {
        name: trans('app.stats.wins'),
        value: HelpersService.numeral(playerInfo.player.pve_wins || 0),
        inline: true,
      },
      {
        name: trans('app.stats.lost'),
        value: HelpersService.numeral(playerInfo.player.pve_lost || 0),
        inline: true,
      },
      {
        name: trans('app.stats.left'),
        value: HelpersService.numeral(playerInfo.full_player?.mode?.pve?.season?.stat?.player_sessions_left || 0),
        inline: true,
      },
      {
        name: trans('app.stats.total'),
        value: HelpersService.numeral(totalGames),
        inline: true,
      },
      {
        name: trans('app.stats.kicked'),
        value: HelpersService.numeral(playerInfo.full_player?.mode?.pve?.season?.stat?.player_sessions_kicked || 0),
        inline: true,
      },
      ...classFields,
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
    ];
  }

  private createPvpFields(playerInfo: PlayerInfo, trans: TranslationFn): APIEmbedField[] {
    const totalGames =
      Number(
        playerInfo.full_player?.complexity?.normal?.mission_type?.mode?.pvp.season?.stat?.player_sessions_won || 0,
      ) +
      Number(
        playerInfo.full_player?.complexity?.normal?.mission_type?.mode?.pvp?.season?.stat?.player_sessions_lost || 0,
      );

    const classFields = ['rifleman', 'medic', 'engineer', 'recon', 'heavy'].map((className) => ({
      name: trans(`app.stats.pvp.${className}.name`, { emoji: this.nestcordService.emojis.get(`wfs_${className}`)?.toString()}),
      value: trans(`app.stats.pvp.${className}.value`, {
        total: trans('app.stats.hours', {
          hours: String(
            HelpersService.secToHours(
              playerInfo?.full_player?.class?.[className]?.mode?.pvp?.season?.stat?.player_playtime,
            ) || 0,
          ),
        }),
        shots: HelpersService.numeral(
          playerInfo.full_player?.class?.[className]?.mode?.pvp?.season?.stat?.player_shots || 0,
        ),
        hits: HelpersService.numeral(
          playerInfo.full_player?.class?.[className]?.mode?.pvp?.season?.stat?.player_hits || 0,
        ),
        heads: HelpersService.numeral(
          playerInfo.full_player?.class?.[className]?.mode?.pvp?.season?.stat?.player_headshots || 0,
        ),
      }),
      inline: true,
    }));

    return [
      {
        name: `${this.nestcordService.emojis.get('wfs_pvp')?.toString()} PVP`,
        value: `**${trans('app.stats.favoriteClass')}:** ${playerInfo.player.favoritPVP}\n**${trans(
          'app.stats.kd',
        )}:** ${playerInfo.player.pvp || 0}`,
      },
      {
        name: trans('app.stats.kills'),
        value: HelpersService.numeral(playerInfo.full_player?.class?.mode?.pvp?.season?.stat?.player_kills_player || 0),
        inline: true,
      },
      {
        name: trans('app.stats.deaths'),
        value: HelpersService.numeral(playerInfo.full_player?.class?.mode?.pvp?.season?.stat?.player_deaths || 0),
        inline: true,
      },
      {
        name: trans('app.stats.wins'),
        value: HelpersService.numeral(playerInfo.player.pvp_wins || 0),
        inline: true,
      },
      {
        name: trans('app.stats.lost'),
        value: HelpersService.numeral(playerInfo.player.pvp_lost || 0),
        inline: true,
      },
      {
        name: trans('app.stats.left'),
        value: HelpersService.numeral(playerInfo.full_player?.mode?.pvp?.season?.stat?.player_sessions_left || 0),
        inline: true,
      },
      {
        name: trans('app.stats.total'),
        value: HelpersService.numeral(totalGames),
        inline: true,
      },
      ...classFields,
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
    ];
  }

  private createOtherFields(achievements: any[], trans: TranslationFn): APIEmbedField[] {
    if (!achievements) return [];

    const completedAchievements = achievements.filter((i) => i.completion_time !== null);

    return [
      {
        name: trans('app.stats.page3.ach_count'),
        value: HelpersService.numeral(completedAchievements.length),
      },
      {
        name: trans('app.stats.page3.reg_date'),
        value: 'no',
        // value: HelpersService.formatDate(achievements[0].start_time),
      },
    ];
  }

  private getPlayerAuthor(nickname: string, rankId: number, server: string): string {
    return `[${server.toUpperCase()}] ${nickname} (${rankId})`;
  }
}
