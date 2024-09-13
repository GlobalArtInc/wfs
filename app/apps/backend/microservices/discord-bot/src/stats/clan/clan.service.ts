import {
  Context,
  DeferCommandInterceptor,
  NestcordService,
  Options,
  SlashCommand,
  SlashCommandContext,
  localizationMapByKey,
} from '@globalart/nestcord';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { ClanSearchDto } from './clan.dtos';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } from 'discord.js';
import { HelpersService } from '../../helpers/helpers.service';
import { UserService } from '../../user/user.service';
import { SettingService } from '../../setting/setting.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { ClanInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class ClanService {
  constructor(
    private readonly internalBotApiService: InternalBotApiService,
    private readonly userService: UserService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly nestcordService: NestcordService,
    private readonly translationService: TranslationService,
  ) {}

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'clan',
    description: 'Retrieve information about clan members',
    nameLocalizations: localizationMapByKey('app.chatCommands.clan.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.clan.desc'),
  })
  async execute(@Context() [interaction]: SlashCommandContext, @Options() { name }: ClanSearchDto) {
    try {
      const embed = await this.createEmbed({
        discordUserId: interaction.user.id,
        name,
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

  private async createEmbed({ discordUserId, name }: { discordUserId: string; name: string }) {
    const components = new ActionRowBuilder<ButtonBuilder>();
    const clanName = name || (await this.userService.getLinkedClan(discordUserId));

    if (!clanName) {
      throw new DiscordErrorException('app.errors.clan_name_not_specified');
    }
    const clanInfos = await this.internalBotApiService.send<ClanInfo[]>('get', `clan`, {
      name: clanName,
    });
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

    const formattedClan = await this.formatClan(clanInfos[0]);
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Green,
    });

    return embed.setTitle(formattedClan.title).setDescription(formattedClan.desc);
  }

  private async formatClan(clanInfo: ClanInfo) {
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
        `${this.nestcordService.getApplicationEmojiPlain(`wfs_rank_${member.rank_id}`)} \`${member.nickname}\` - \`${HelpersService.numeral(
          member.clan_points,
        )}\``,
      );
    });

    const addRoleToDescription = (role: string, roleMembers: string[], transKey: string, emoji: string) => {
      if (roleMembers.length > 0) {
        description.push(`\r\n**${this.translationService.get(transKey)}** ${emoji}\r\n${roleMembers.join('\r\n')}`);
      }
    };

    addRoleToDescription(
      'MASTER',
      roles.MASTER,
      'app.clan.roles.master',
      this.nestcordService.getApplicationEmojiPlain('wfs_master'),
    );
    addRoleToDescription(
      'OFFICER',
      roles.OFFICER,
      'app.clan.roles.officers',
      this.nestcordService.getApplicationEmojiPlain('wfs_officer'),
    );
    addRoleToDescription('REGULAR', roles.REGULAR, 'app.clan.roles.regulars', '');

    return {
      title: this.translationService.get('app.clan.title', {
        name: clanInfo.data.name,
        server: clanInfo.server.toUpperCase(),
      }),
      desc: description.join(' '),
    };
  }
}
