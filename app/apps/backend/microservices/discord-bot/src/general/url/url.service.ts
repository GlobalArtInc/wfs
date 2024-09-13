import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, EmbedBuilder } from 'discord.js';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class GeneralUrlService {
  constructor(
    private readonly client: Client,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly translationService: TranslationService,
  ) {}

  public async createEmbed() {
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Blue,
    });
    embed
      .setTitle(this.translationService.get('app.displayEmbeds.link.title'))
      .setDescription(this.translationService.get('app.displayEmbeds.link.description', { link: this.createLink() }));

    return embed;
  }

  public component() {
    const buttons = new ButtonBuilder()
      .setLabel(this.translationService.get('app.labels.link'))
      .setStyle(ButtonStyle.Link)
      .setURL(this.createLink());
    return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
  }

  private createLink() {
    return `https://discord.com/oauth2/authorize?client_id=${this.client.application.id}&scope=bot+applications.commands&permissions=137439307856`;
  }
}