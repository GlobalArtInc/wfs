import {
  Context,
  DeferCommandInterceptor,
  Options,
  SlashCommand,
  SlashCommandContext,
  localizationMapByKey,
} from '@globalart/nestcord';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { TopCommandOptions } from './top.dtos';
import { TopService } from './top.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { CommandCategoryEnum } from '@app/shared/enums';

@Injectable()
export class TopInteractions {
  constructor(
    private readonly topService: TopService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'top',
    category: CommandCategoryEnum.STATS,
    description: 'The best players on the missions',
    nameLocalizations: localizationMapByKey('app.chatCommands.top.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.top.desc'),
  })
  async execute(@Context() [interaction]: SlashCommandContext, @Options() { mission }: TopCommandOptions) {
    try {
      const embed = await this.topService.createEmbed(mission);

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
