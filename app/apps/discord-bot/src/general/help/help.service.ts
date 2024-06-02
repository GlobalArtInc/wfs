import {
  SlashCommand,
  localizationMapByKey,
  Context,
  SlashCommandContext,
  CurrentTranslate,
  TranslationFn,
  NestCordPaginationService,
  PageBuilder,
  LOCALIZATION_ADAPTER,
  DefaultLocalizationAdapter,
  ButtonAppearance,
  Button,
  ComponentParam,
  ButtonContext,
} from '@globalart/nestcord';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ButtonInteraction, ButtonStyle, CacheType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { PageEnum } from './help.enums';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';

@Injectable()
export class GeneralHelpService {
  public constructor(
    @Inject(LOCALIZATION_ADAPTER)
    private readonly localizationAdapter: DefaultLocalizationAdapter,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  public setButtons(interaction: ChatInputCommandInteraction<CacheType> | ButtonInteraction) {
    return [
      [
        {
          customId: 'player',
          label: this.localizationAdapter.getTranslation('app.displayEmbeds.help.player.title', interaction.locale),
          style: ButtonStyle.Secondary,
        },
        {
          customId: 'clan',
          label: this.localizationAdapter.getTranslation('app.displayEmbeds.help.clan.title', interaction.locale),
          style: ButtonStyle.Secondary,
        },
        {
          customId: 'other',
          label: this.localizationAdapter.getTranslation('app.displayEmbeds.help.other.title', interaction.locale),
          style: ButtonStyle.Secondary,
        },
      ],
      [
        {
          label: this.localizationAdapter.getTranslation('app.displayEmbeds.help.openWebsite', interaction.locale),
          style: ButtonStyle.Link,
          link: 'http://wfs.globalart.dev',
        },
        {
          label: this.localizationAdapter.getTranslation('app.displayEmbeds.help.leaveReview', interaction.locale),
          style: ButtonStyle.Link,
          link: 'https://bots.server-discord.com/800354757297438750',
        },
        {
          label: this.localizationAdapter.getTranslation('app.displayEmbeds.help.donate', interaction.locale),
          style: ButtonStyle.Link,
          link: 'https://www.donationalerts.com/r/rozmarinus',
        },
        {
          label: this.localizationAdapter.getTranslation('app.displayEmbeds.help.supportServer', interaction.locale),
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
          .setTitle(this.localizationAdapter.getTranslation('app.displayEmbeds.help.player.title', interaction.locale))
          .setDescription(
            this.localizationAdapter.getTranslation('app.displayEmbeds.help.player.description', interaction.locale),
          ),
      ]),
      new PageBuilder().setEmbeds([
        clanEmbed
          .setTitle(this.localizationAdapter.getTranslation('app.displayEmbeds.help.clan.title', interaction.locale))
          .setDescription(
            this.localizationAdapter.getTranslation('app.displayEmbeds.help.clan.description', interaction.locale),
          ),
      ]),
      new PageBuilder().setEmbeds([
        otherEmbed
          .setTitle(this.localizationAdapter.getTranslation('app.displayEmbeds.help.other.title', interaction.locale))
          .setDescription(
            this.localizationAdapter.getTranslation('app.displayEmbeds.help.other.description', interaction.locale),
          ),
      ]),
    ];
  }
}
