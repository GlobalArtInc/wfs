import { CommandCategoryEnum } from '@app/shared/enums';
import {
    Context,
    DeferCommandInterceptor,
    Options,
    SlashCommandContext,
    Subcommand,
    createCommandGroupDecorator,
    localizationMapByKey,
} from '@globalart/nestcord';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { SetClanOptions, SetPlayerOptions, SetServerOptions } from './set.dtos';
import { SetService } from './set.service';

export const SetCommandDecorator = createCommandGroupDecorator({
  name: 'set',
  description: 'Settings management of the bot',
  category: CommandCategoryEnum.GENERAL,
});

@UseInterceptors(DeferCommandInterceptor)
@Injectable()
@SetCommandDecorator()
export class SetInteractions {
  constructor(
    private readonly setService: SetService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @Subcommand({
    name: 'list',
    description: 'Settings of the user',
    nameLocalizations: localizationMapByKey('app.chatCommands.options.set.list.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.options.set.list.desc'),
  })
  async executeList(@Context() [interaction]: SlashCommandContext) {
    try {
      const embed = await this.setService.getUserSettingsAndGetEmbed(interaction.user.id);

      return interaction.followUp({ embeds: [embed] });
    } catch (err) {
      console.log(err);
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

  @Subcommand({
    name: 'server',
    description: 'Set server',
    nameLocalizations: localizationMapByKey('app.chatCommands.options.set.server.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.options.set.server.desc'),
  })
  async executeSetServer(@Options() { server }: SetServerOptions, @Context() [interaction]: SlashCommandContext) {
    try {
      const embed = await this.setService.setServerAndGetEmbed(interaction.user.id, server);

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

  @Subcommand({
    name: 'player',
    description: 'Set player',
    nameLocalizations: localizationMapByKey('app.chatCommands.options.set.player.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.options.set.player.desc'),
  })
  async executeSetPlayer(@Options() { name }: SetPlayerOptions, @Context() [interaction]: SlashCommandContext) {
    try {
      const embed = await this.setService.setPlayerAndGetEmbed(interaction.user.id, name);

      return interaction.followUp({ embeds: [embed] });
    } catch (err) {
      const errorEmbed = this.discordHelpersService.buildErrorEmbed({
        message:
          err?.response?.discordMessage ||
          (err?.response?.code ? `app.errors.${err.response.code}` : 'app.errors.unknown'),
        variables: { name },
      });
      return interaction.followUp({
        embeds: [errorEmbed],
      });
    }
  }

  @Subcommand({
    name: 'clan',
    description: 'Set clan',
    nameLocalizations: localizationMapByKey('app.chatCommands.options.set.clan.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.options.set.clan.desc'),
  })
  async executeSetClan(@Options() { name }: SetClanOptions, @Context() [interaction]: SlashCommandContext) {
    try {
      const embed = await this.setService.setClanAndGetEmbed(interaction.user.id, name);

      return interaction.followUp({ embeds: [embed] });
    } catch (err) {
      const errorEmbed = this.discordHelpersService.buildErrorEmbed({
        message:
          err?.response?.discordMessage ||
          (err?.response?.code ? `app.errors.${err.response.code}` : 'app.errors.unknown'),
        variables: { name },
      });
      return interaction.followUp({
        embeds: [errorEmbed],
      });
    }
  }
}
