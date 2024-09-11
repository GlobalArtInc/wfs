import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { OnlineInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { DefaultLocalizationAdapter, LOCALIZATION_ADAPTER, TranslationFn } from '@globalart/nestcord';
import { Inject, Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';

@Injectable()
export class GeneralOnlineService {
  public constructor(
    @Inject(LOCALIZATION_ADAPTER)
    private readonly localizationAdapter: DefaultLocalizationAdapter,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  public buttons(trans: TranslationFn) {
    const row = [
      new ButtonBuilder({
        customId: 'wfs/reload',
        label: trans('app.displayEmbeds.online.reload'),
        style: ButtonStyle.Primary,
      }),
    ];

    return new ActionRowBuilder<ButtonBuilder>().addComponents(row);
  }

  public async fetchOnlineAndRenderEmbed(trans: TranslationFn) {
    const onlineInfo = await this.internalBotApiService.send<OnlineInfo>('get', `online`);
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Blue,
    });
    embed.setTitle(trans('app.displayEmbeds.online.title')).setDescription(
      trans('app.displayEmbeds.online.description', {
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
