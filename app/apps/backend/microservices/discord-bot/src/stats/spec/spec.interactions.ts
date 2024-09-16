import {
  SlashCommand,
  localizationMapByKey,
  Context,
  SlashCommandContext,
  Options,
  DeferCommandInterceptor,
} from '@globalart/nestcord';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { SpecSearchDto } from './spec.dtos';
import { SpecService } from './spec.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { CommandCategoryEnum } from '@app/shared/enums';

@Injectable()
export class SpecInteractions {
  constructor(
    private readonly statsSpecService: SpecService,
    private discordHelpersService: DiscordHelpersService,
  ) {}

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'spec',
    category: CommandCategoryEnum.STATS,
    description: 'Retrieve information about player missions',
    nameLocalizations: localizationMapByKey('app.chatCommands.spec.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.spec.desc'),
  })
  async execute(@Options() { name }: SpecSearchDto, @Context() [interaction]: SlashCommandContext) {
    try {
      const embed = await this.statsSpecService.createEmbed({
        discordUserId: interaction.user.id,
        name,
      });

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
