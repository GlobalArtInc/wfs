import { NestcordService, PageBuilder } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { APIEmbedField, ButtonStyle, CacheType, ChatInputCommandInteraction, Colors } from 'discord.js';
import { HelpersService } from '../../helpers/helpers.service';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';
import { TranslationService } from '../../translation/translation.service';
import * as moment from 'moment';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UserService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly requestClsService: RequestClsService,
    private readonly nestcordService: NestcordService,
    private translationService: TranslationService,
  ) {}

  async createEmbed(name: string) {
    const discordUser = this.requestClsService.getUser();
    const playerName = name || (await this.userService.getLinkedPlayer(discordUser.id));
    const playerInfo = await this.internalBotApiService.send<PlayerInfo>('get', `player`, {
      name: playerName,
    });
    const footer = {
      text: playerInfo.state.errorStatus
        ? this.translationService.get(`app.errors.player.status.${playerInfo.state.status}`, {
            name: playerInfo.player.nickname,
            updatedAt: moment(playerInfo.state.updatedAt).format('DD.MM.YYYY hh:mm (GMT)'),
          })
        : undefined,
    };

    const [pveEmbed, pvpEmbed, otherEmbed] = await Promise.all([
      this.discordHelpersService.buildEmbed({ color: Colors.Blue, footer }),
      this.discordHelpersService.buildEmbed({ color: Colors.Blue, footer }),
      this.discordHelpersService.buildEmbed({ color: Colors.Blue, footer }),
    ]);
    const commonFields: APIEmbedField[] = this.createCommonFields(playerInfo);

    pveEmbed
      .setAuthor(this.createAuthorObject(playerInfo))
      .setFields(...commonFields, ...this.createPveFields(playerInfo))
      .setThumbnail(this.nestcordService.getApplicationAsset('common')?.url);
    pvpEmbed
      .setAuthor(this.createAuthorObject(playerInfo))
      .setFields(...commonFields, ...this.createPvpFields(playerInfo))
      .setThumbnail(this.nestcordService.getApplicationAsset('common')?.url);
    otherEmbed
      .setAuthor(this.createAuthorObject(playerInfo))
      .setFields(...commonFields, ...this.createOtherFields(playerInfo.achievements))
      .setThumbnail(this.nestcordService.getApplicationAsset('common')?.url);

    return [
      new PageBuilder().setEmbeds([pveEmbed]),
      new PageBuilder().setEmbeds([pvpEmbed]),
      new PageBuilder().setEmbeds([otherEmbed]),
    ];
  }

  public setButtons(interaction: ChatInputCommandInteraction<CacheType>, name: string) {
    return [
      [
        {
          customId: 'pve',
          label: 'PVE',
          emoji: this.nestcordService.getApplicationEmojiPlain('wfs_pve'),
          style: ButtonStyle.Secondary,
          options: name,
        },
        {
          customId: 'pvp',
          label: 'PVP',
          emoji: this.nestcordService.getApplicationEmojiPlain('wfs_pvp'),
          style: ButtonStyle.Secondary,
          options: name,
        },
        {
          customId: 'other',
          label: 'Other',
          emoji: this.nestcordService.getApplicationEmojiPlain('wfs_award'),
          style: ButtonStyle.Secondary,
          options: name,
        },
      ],
    ];
  }

  private createCommonFields(playerInfo: PlayerInfo): APIEmbedField[] {
    return [
      {
        name: this.translationService.get('app.stats.clan'),
        value: playerInfo.player.clan_name || 'no',
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.time_in_game.name'),
        value: this.translationService.get('app.stats.time_in_game.value', {
          hours: playerInfo.player.playtime_h,
          minutes: playerInfo.player.playtime_m,
        }),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.experience'),
        value: HelpersService.numeral(playerInfo.player.experience),
        inline: true,
      },
    ];
  }

  private createPveFields(playerInfo: PlayerInfo): APIEmbedField[] {
    const totalGames = Number(playerInfo.player.pve_wins || 0) + Number(playerInfo.player.pve_lost || 0);

    const classFields = ['rifleman', 'medic', 'engineer', 'recon', 'heavy'].map((className) => ({
      name: this.translationService.get(`app.stats.pve.${className}.name`, {
        emoji: this.nestcordService.getApplicationEmojiPlain(`wfs_${className}`),
      }),
      value: this.translationService.get(`app.stats.pve.${className}.value`, {
        total: this.translationService.get('app.stats.hours', {
          hours: String(
            HelpersService.secToHours(
              playerInfo.fullPlayer?.class?.[className]?.mode?.pve?.season?.stat?.player_playtime,
            ) || 0,
          ),
        }),
        shots: HelpersService.numeral(
          playerInfo.fullPlayer?.class?.[className]?.mode?.pve?.season?.stat?.player_shots || 0,
        ),
        hits: HelpersService.numeral(
          playerInfo.fullPlayer?.class?.[className]?.mode?.pve?.season?.stat?.player_hits || 0,
        ),
        heads: HelpersService.numeral(
          playerInfo.fullPlayer?.class?.[className]?.mode?.pve?.season?.stat?.player_headshots || 0,
        ),
      }),
      inline: true,
    }));

    return [
      {
        name: `${this.nestcordService.getApplicationEmojiPlain('wfs_pve')} PVE`,
        value: `**${this.translationService.get('app.stats.favoriteClass')}:** ${playerInfo.player.favoritPVE}\n**${this.translationService.get(
          'app.stats.kd',
        )}:** ${playerInfo.player.pve || 0}`,
      },
      {
        name: this.translationService.get('app.stats.kills'),
        value: HelpersService.numeral(playerInfo.fullPlayer?.class?.mode?.pve?.season?.stat?.player_kills_ai || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.friendly_kills'),
        value: HelpersService.numeral(
          playerInfo.fullPlayer?.class?.mode?.pve?.season?.stat?.player_kills_player_friendly || 0,
        ),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.deaths'),
        value: HelpersService.numeral(playerInfo.fullPlayer?.class?.mode?.pve?.season?.stat?.player_deaths || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.wins'),
        value: HelpersService.numeral(playerInfo.player.pve_wins || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.lost'),
        value: HelpersService.numeral(playerInfo.player.pve_lost || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.left'),
        value: HelpersService.numeral(playerInfo.fullPlayer?.mode?.pve?.season?.stat?.player_sessions_left || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.total'),
        value: HelpersService.numeral(totalGames),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.kicked'),
        value: HelpersService.numeral(playerInfo.fullPlayer?.mode?.pve?.season?.stat?.player_sessions_kicked || 0),
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
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

  private createPvpFields(playerInfo: PlayerInfo): APIEmbedField[] {
    const totalGames =
      Number(
        playerInfo.fullPlayer?.complexity?.normal?.mission_type?.mode?.pvp.season?.stat?.player_sessions_won || 0,
      ) +
      Number(
        playerInfo.fullPlayer?.complexity?.normal?.mission_type?.mode?.pvp?.season?.stat?.player_sessions_lost || 0,
      );

    const classFields = ['rifleman', 'medic', 'engineer', 'recon', 'heavy'].map((className) => ({
      name: this.translationService.get(`app.stats.pvp.${className}.name`, {
        emoji: this.nestcordService.getApplicationEmojiPlain(`wfs_${className}`),
      }),
      value: this.translationService.get(`app.stats.pvp.${className}.value`, {
        total: this.translationService.get('app.stats.hours', {
          hours: String(
            HelpersService.secToHours(
              playerInfo?.fullPlayer?.class?.[className]?.mode?.pvp?.season?.stat?.player_playtime,
            ) || 0,
          ),
        }),
        shots: HelpersService.numeral(
          playerInfo.fullPlayer?.class?.[className]?.mode?.pvp?.season?.stat?.player_shots || 0,
        ),
        hits: HelpersService.numeral(
          playerInfo.fullPlayer?.class?.[className]?.mode?.pvp?.season?.stat?.player_hits || 0,
        ),
        heads: HelpersService.numeral(
          playerInfo.fullPlayer?.class?.[className]?.mode?.pvp?.season?.stat?.player_headshots || 0,
        ),
      }),
      inline: true,
    }));

    return [
      {
        name: `${this.nestcordService.getApplicationEmojiPlain('wfs_pvp')} PVP`,
        value: `**${this.translationService.get('app.stats.favoriteClass')}:** ${playerInfo.player.favoritPVP}\n**${this.translationService.get(
          'app.stats.kd',
        )}:** ${playerInfo.player.pvp || 0}`,
      },
      {
        name: this.translationService.get('app.stats.kills'),
        value: HelpersService.numeral(playerInfo.fullPlayer?.class?.mode?.pvp?.season?.stat?.player_kills_player || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.deaths'),
        value: HelpersService.numeral(playerInfo.fullPlayer?.class?.mode?.pvp?.season?.stat?.player_deaths || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.wins'),
        value: HelpersService.numeral(playerInfo.player.pvp_wins || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.lost'),
        value: HelpersService.numeral(playerInfo.player.pvp_lost || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.left'),
        value: HelpersService.numeral(playerInfo.fullPlayer?.mode?.pvp?.season?.stat?.player_sessions_left || 0),
        inline: true,
      },
      {
        name: this.translationService.get('app.stats.total'),
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

  private createOtherFields(achievements: any[]): APIEmbedField[] {
    if (!achievements) return [];

    const completedAchievements = achievements.filter((i) => i.completion_time !== null);

    return [
      {
        name: this.translationService.get('app.stats.page3.ach_count'),
        value: HelpersService.numeral(completedAchievements.length),
      },
      {
        name: this.translationService.get('app.stats.page3.reg_date'),
        value: 'no',
      },
    ];
  }

  private createAuthorObject(playerInfo: PlayerInfo): { name: string; url: string; iconURL: string } {
    return {
      name: `[${playerInfo.server.toUpperCase()}] ${playerInfo.player.nickname} (${playerInfo.player.rank_id})`,
      url: `https://wfts.su/profile/${playerInfo.player.nickname}`,
      iconURL: this.nestcordService.getApplicationEmoji(`wfs_rank_${playerInfo.player.rank_id}`)?.imageURL() || '',
    };
  }
}
