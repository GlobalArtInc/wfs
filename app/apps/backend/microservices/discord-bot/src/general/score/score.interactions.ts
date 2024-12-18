import { CommandCategoryEnum } from '@app/shared/enums';
import {
  Context,
  DeferCommandInterceptor,
  localizationMapByKey,
  Options,
  SlashCommand,
  SlashCommandContext
} from '@globalart/nestcord';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { ScoreDto } from './score.dtos';
import { GeneralScoreService } from './score.service';

@Injectable()
export class GeneralScoreInteractions {
  constructor(
    private readonly generalScoreService: GeneralScoreService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'score',
    category: CommandCategoryEnum.GENERAL,
    description: 'Retrieve score on spec-ops',
    nameLocalizations: localizationMapByKey('app.chatCommands.score.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.score.desc'),
  })
  async execute(
    @Options() { mission }: ScoreDto,
    @Context() [interaction]: SlashCommandContext) {
    try {
      const embed = await this.generalScoreService.createEmbed(mission);

      return interaction.followUp({ embeds: [embed] });
    } catch (err) {
      console.log(err)
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
