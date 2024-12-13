import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { AutocompleteInterceptor } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';

@Injectable()
export class AutoCompleteNicknameInterceptor extends AutocompleteInterceptor {
  constructor(
    private readonly internalBotApiService: InternalBotApiService,
  ) {
    super();
  }

  public async transformOptions(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);
    const nickname = focused.value.toString();

    if (!nickname) {
      return interaction.respond([]);
    }

    let response;
    try {
      response = await this.internalBotApiService.send<{ id: string; server: string; nickname: string }[]>(
        'get',
        'player/searchByName',
        { name: nickname }
      );
    } catch (error) {
      console.error('Error fetching player data:', error);
      return interaction.respond([]);
    }

    const choices = response.map(player => ({
      server: player.server,
      nickname: player.nickname,
    }));

    if (!choices.some(choice => choice.nickname === nickname)) {
      choices.unshift({ server: '-', nickname });
    }

    const limitedChoices = choices.slice(0, 25);

    await interaction.respond(
      limitedChoices.map(choice => ({
        name: `[${choice.server}] ${choice.nickname}`,
        value: choice.nickname,
      }))
    );
  }
}
