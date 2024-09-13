import {
  Button,
  Context,
  ButtonContext,
  SlashCommand,
  localizationMapByKey,
  SlashCommandContext,
  DeferCommandInterceptor,
} from '@globalart/nestcord';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { GeneralOnlineService } from './online.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';

@Injectable()
export class GeneralOnlineInteractions {
  constructor(
    private readonly generalOnlineService: GeneralOnlineService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @Button('wfs/reload')
  async reloadInteraction(@Context() [interaction]: ButtonContext) {
    const embedData = await this.generalOnlineService.createEmbed();

    return interaction.update({ embeds: [embedData] });
  }

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'online',
    description: 'Retrieve online player stats',
    nameLocalizations: localizationMapByKey('app.chatCommands.online.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.online.desc'),
  })
  async execute(@Context() [interaction]: SlashCommandContext) {
    try {
      const embedData = await this.generalOnlineService.createEmbed();
      const components = this.generalOnlineService.createButtons();

      return interaction.followUp({ embeds: [embedData], components: [components] });
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
}
