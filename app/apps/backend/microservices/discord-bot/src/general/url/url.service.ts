import { TranslationFn } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, EmbedBuilder } from 'discord.js';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';

@Injectable()
export class GeneralUrlService {
  constructor(
    private readonly client: Client,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  public async embed(trans: TranslationFn) {
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Blue,
    });
    embed
      .setTitle(trans('app.displayEmbeds.link.title'))
      .setDescription(trans('app.displayEmbeds.link.description', { link: this.createLink() }));

    return embed;
  }

  public component(trans: TranslationFn) {
    const buttons = new ButtonBuilder()
      .setLabel(trans('app.labels.link'))
      .setStyle(ButtonStyle.Link)
      .setURL(this.createLink());
    return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
  }

  private createLink() {
    return `https://discord.com/oauth2/authorize?client_id=${this.client.application.id}&scope=bot+applications.commands&permissions=137439307856`;
  }
}
