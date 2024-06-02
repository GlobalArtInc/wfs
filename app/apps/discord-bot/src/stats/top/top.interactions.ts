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
import { TopCommandOptions } from './top.dtos';
import { TopService } from './top.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';

@Injectable()
export class TopInteractions {
  constructor(
    private readonly topService: TopService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'top',
    description: 'The best players on the missions',
    nameLocalizations: localizationMapByKey('app.chatCommands.top.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.top.desc'),
  })
  async execute(
    @Context() [interaction]: SlashCommandContext,
    @Options() { mission }: TopCommandOptions,
    @CurrentTranslate() trans: TranslationFn,
  ) {
    try {
      const embed = await this.topService.embed(mission);

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
}
