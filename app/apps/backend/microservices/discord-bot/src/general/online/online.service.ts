import { Inject, Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { OnlineInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class GeneralOnlineService {
  public constructor(
    private readonly internalBotApiService: InternalBotApiService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly translationService: TranslationService,
  ) {}

  public createButtons(): ActionRowBuilder<ButtonBuilder> {
    const button = new ButtonBuilder()
      .setCustomId('wfs/reload')
      .setLabel(this.translationService.get('app.displayEmbeds.online.reload'))
      .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
  }

  public async createEmbed(): Promise<EmbedBuilder> {
    const onlineInfo = await this.internalBotApiService.send<OnlineInfo>('get', 'online');
    const embed = await this.discordHelpersService.buildEmbed({ color: Colors.Blue });

    embed.setTitle(this.translationService.get('app.displayEmbeds.online.title')).setDescription(
      this.translationService.get('app.displayEmbeds.online.description', {
        ruPvp: onlineInfo.ru.pvp,
        ruPve: onlineInfo.ru.pve,
        ruTotal: onlineInfo.ru.all,
        ru24Max: onlineInfo.ru.max24.all,
        ruUpdatedAt: onlineInfo.ru.updatedAt,
        euPvp: onlineInfo.int.pvp,
        euPve: onlineInfo.int.pve,
        euTotal: onlineInfo.int.all,
        eu24Max: onlineInfo.int.max24.all,
        euUpdatedAt: onlineInfo.int.updatedAt,
      }),
    );

    return embed;
  }
}
