import { SlashCommand, localizationMapByKey, Context, SlashCommandContext, Options } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { WeaponsInteractionDto } from './weapons.dtos';
import { UtilityWeaponsService } from './weapons.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';

@Injectable()
export class UtilityWeaponsInteractions {
  constructor(
    private readonly utilityWeaponsService: UtilityWeaponsService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @SlashCommand({
    name: 'weapons',
    description: 'Retrieve detailed information about weapons',
    nameLocalizations: localizationMapByKey('app.chatCommands.weapons.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.weapons.desc'),
  })
  async execute(@Context() [interaction]: SlashCommandContext, @Options() { name }: WeaponsInteractionDto) {
    try {
      const data = await this.utilityWeaponsService.renderSelectionMenu(interaction.user.id, name);

      return interaction.reply(data);
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
