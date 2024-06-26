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
import { AchievementsDto } from './achievements.dtos';
import { AchievementsService } from './achievements.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';

@Injectable()
export class AchievementsInteractions {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'a',
    description: 'Retrive achievements on spec ops',
    nameLocalizations: localizationMapByKey('app.chatCommands.achievements.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.achievements.desc'),
  })
  async execute(
    @Options() { name, mission }: AchievementsDto,
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() trans: TranslationFn,
  ) {
    try {
      const embed = await this.achievementsService.embed(name, mission, trans);

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
