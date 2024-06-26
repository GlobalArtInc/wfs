import {
  Context,
  CurrentTranslate,
  DeferCommandInterceptor,
  Options,
  SlashCommand,
  SlashCommandContext,
  TranslationFn,
  localizationMapByKey,
} from '@globalart/nestcord';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { ClanSearchDto } from './clan.dtos';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } from 'discord.js';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { HelpersService } from '../../helpers/helpers.service';
import { ClanInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { UserService } from '../../user/user.service';
import { SettingService } from '../../setting/setting.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';

@Injectable()
export class ClanService {
  constructor(
    private readonly internalBotApiService: InternalBotApiService,
    private readonly userService: UserService,
    private readonly settingService: SettingService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'clan',
    description: 'Retrieve information about clan members',
    nameLocalizations: localizationMapByKey('app.chatCommands.clan.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.clan.desc'),
  })
  async execute(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name }: ClanSearchDto,
    @CurrentTranslate() trans: TranslationFn,
  ) {
    try {
      const embed = await this.createEmbed({
        discordUserId: interaction.user.id,
        name,
        trans,
      });

      return interaction.followUp({ embeds: [embed] });
    } catch (err) {
      const errorEmbed = this.discordHelpersService.buildErrorEmbed({
        message:
          err?.response?.discordMessage ||
          (err?.response?.code ? `app.errors.${err.response.code}` : 'app.errors.unknown'),
      });
      return interaction.followUp({
        embeds: [errorEmbed],
      });
    }
  }

  private async createEmbed({
    discordUserId,
    name,
    trans,
  }: {
    discordUserId: string;
    name: string;
    trans: TranslationFn;
  }) {
    const components = new ActionRowBuilder<ButtonBuilder>();
    const clanName = name || (await this.userService.getLinkedClan(discordUserId));

    if (!clanName) {
      throw new DiscordErrorException('app.errors.clan_name_not_specified');
    }
    const clanInfos = await this.internalBotApiService.send<ClanInfo[]>('get', `clan/${clanName}`);
    if (!clanInfos.length) {
      throw new DiscordErrorException('errors.clan_not_found');
    }

    clanInfos.forEach((clanInfo) => {
      components.addComponents(
        new ButtonBuilder()
          .setLabel(clanInfo.server.toUpperCase())
          .setCustomId(`none@${clanInfo.server}`)
          .setStyle(ButtonStyle.Secondary),
      );
    });

    const formattedClan = await this.formatClan(clanInfos[0], trans);
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Green,
    });

    return embed.setTitle(formattedClan.title).setDescription(formattedClan.desc);
  }

  private async formatClan(clanInfo: ClanInfo, trans: TranslationFn) {
    const setting = await this.settingService.getValueByKey('emoji_ranks');

    const description: string[] = [];
    description.push(`**ID клана:** \`${clanInfo.data.id}\`\r\n`);

    const members = clanInfo.data.members;
    const roles: { MASTER: string[]; OFFICER: string[]; REGULAR: string[] } = {
      MASTER: [],
      OFFICER: [],
      REGULAR: [],
    };

    members.forEach((member) => {
      roles[member.clan_role].push(
        `${setting['rank_' + member.rank_id]} \`${member.nickname}\` - \`${HelpersService.numeral(
          member.clan_points,
        )}\``,
      );
    });

    const addRoleToDescription = (role: string, roleMembers: string[], transKey: string, emoji: string) => {
      if (roleMembers.length > 0) {
        description.push(`\r\n**${trans(transKey)}** ${emoji}\r\n${roleMembers.join('\r\n')}`);
      }
    };

    addRoleToDescription('MASTER', roles.MASTER, 'app.clan.roles.master', '<:wfs_master:802495512179245066>');
    addRoleToDescription('OFFICER', roles.OFFICER, 'app.clan.roles.officers', '<:wfs_officer:802495502171504651>');
    addRoleToDescription('REGULAR', roles.REGULAR, 'app.clan.roles.regulars', '');

    return {
      title: trans('app.clan.title', {
        name: clanInfo.data.name,
        server: clanInfo.server.toUpperCase(),
      }),
      desc: description.join(' '),
    };
  }
}
