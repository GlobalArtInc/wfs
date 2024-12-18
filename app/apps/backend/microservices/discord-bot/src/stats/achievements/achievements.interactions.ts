import { CommandCategoryEnum } from '@app/shared/enums';
import {
  Context,
  DeferCommandInterceptor,
  Options,
  SlashCommand,
  SlashCommandContext,
  localizationMapByKey,
} from '@globalart/nestcord';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { AutoCompleteNicknameInterceptor } from '../../interceptors';
import { AchievementsDto } from './achievements.dtos';
import { AchievementsService } from './achievements.service';

@Injectable()
export class AchievementsInteractions {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @UseInterceptors(DeferCommandInterceptor)
  @UseInterceptors(AutoCompleteNicknameInterceptor)
  @SlashCommand({
    name: 'a',
    category: CommandCategoryEnum.STATS,
    description: 'Retrive achievements on spec ops',
    nameLocalizations: localizationMapByKey('app.chatCommands.achievements.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.achievements.desc'),
  })
  async execute(@Options() { name, mission }: AchievementsDto, @Context() [interaction]: SlashCommandContext) {
    try {
      const embed = await this.achievementsService.createEmbed(name, mission);

      return interaction.followUp({ embeds: [embed] });
    } catch (err) {
      console.log(err);
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
