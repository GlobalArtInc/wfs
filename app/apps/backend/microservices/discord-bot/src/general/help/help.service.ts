import { NestcordService, PageBuilder } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { ButtonInteraction, ButtonStyle, CacheType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class GeneralHelpService {
  public constructor(
    private readonly translationService: TranslationService,
    private readonly discordHelpersService: DiscordHelpersService,
    private nestcordService: NestcordService,
  ) {}

  public setButtons(interaction: ChatInputCommandInteraction<CacheType> | ButtonInteraction) {
    return [
      [
        {
          customId: 'player',
          label: this.translationService.get('app.displayEmbeds.help.player.title'),
          style: ButtonStyle.Secondary,
        },
        {
          customId: 'clan',
          label: this.translationService.get('app.displayEmbeds.help.clan.title'),
          style: ButtonStyle.Secondary,
        },
        {
          customId: 'other',
          label: this.translationService.get('app.displayEmbeds.help.other.title'),
          style: ButtonStyle.Secondary,
        },
      ],
      [
        {
          label: this.translationService.get('app.displayEmbeds.help.openWebsite'),
          style: ButtonStyle.Link,
          link: 'https://top.gg/bot/800354757297438750',
        },
        {
          label: this.translationService.get('app.displayEmbeds.help.leaveReview'),
          style: ButtonStyle.Link,
          link: 'https://bots.server-discord.com/800354757297438750',
        },
        {
          label: this.translationService.get('app.displayEmbeds.help.donate'),
          style: ButtonStyle.Link,
          link: 'https://www.donationalerts.com/r/rozmarinus',
        },
        {
          label: this.translationService.get('app.displayEmbeds.help.supportServer'),
          style: ButtonStyle.Link,
          link: 'https://discord.gg/BBFhU8g',
        },
      ],
    ];
  }

  public async setPages(interaction: ChatInputCommandInteraction<CacheType> | ButtonInteraction): Promise<any> {
    const [playerEmbed, clanEmbed, otherEmbed] = await Promise.all([
      this.discordHelpersService.buildEmbed(),
      this.discordHelpersService.buildEmbed(),
      this.discordHelpersService.buildEmbed(),
    ]);

    return [
      new PageBuilder().setEmbeds([
        playerEmbed
          .setTitle(this.translationService.get('app.displayEmbeds.help.player.title'))
          .setDescription(this.translationService.get('app.displayEmbeds.help.player.description'))
          .setThumbnail(this.nestcordService.getApplicationAsset('common')?.url),
      ]),
      new PageBuilder().setEmbeds([
        clanEmbed
          .setTitle(this.translationService.get('app.displayEmbeds.help.clan.title'))
          .setDescription(this.translationService.get('app.displayEmbeds.help.clan.description'))
          .setThumbnail(this.nestcordService.getApplicationAsset('common')?.url),
      ]),
      new PageBuilder().setEmbeds([
        otherEmbed
          .setTitle(this.translationService.get('app.displayEmbeds.help.other.title'))
          .setDescription(this.translationService.get('app.displayEmbeds.help.other.description'))
          .setThumbnail(this.nestcordService.getApplicationAsset('common')?.url),
      ]),
    ];
  }
}
