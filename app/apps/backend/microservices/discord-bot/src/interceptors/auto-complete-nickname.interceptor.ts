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
    const response = await this.internalBotApiService.send<{ id: string; server: string; nickname: string }[]>(
      'get', 
      'player/searchByName', 
      { name: nickname }
    );

    const choices = response.map(player => player.nickname);

    if (!choices.includes(nickname)) {
      choices.unshift(nickname);
    }

    const limitedChoices = choices.slice(0, 25);

    if (!nickname) {
      return interaction.respond([]);
    }

    await interaction.respond(
      limitedChoices.map(choice => ({ name: choice, value: choice }))
    );
  }
}
