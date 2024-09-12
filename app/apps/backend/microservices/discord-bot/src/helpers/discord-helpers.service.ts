import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Colors, EmbedBuilder, EmbedData } from 'discord.js';
import { DefaultLocalizationAdapter, LOCALIZATION_ADAPTER } from '@globalart/nestcord';
import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';

@Injectable()
export class DiscordHelpersService {
  constructor(
    @Inject(LOCALIZATION_ADAPTER)
    private readonly localizationAdapter: DefaultLocalizationAdapter,
    private readonly requestClsService: RequestClsService,
    private readonly userService: UserService,
  ) {}

  async buildEmbed(data?: EmbedData) {
    const user = this.requestClsService.getUser();
    const locale = this.requestClsService.getUserLang();
    const userVip = await this.userService.userVip(user.id);

    const embed = new EmbedBuilder();

    let footer = data?.footer;
    let color = data?.color || Colors.Green;

    if (userVip) {
      footer = {
        text: [data?.footer?.text, this.localizationAdapter.getTranslation('app.footer.vip', locale)].join('\r\n'),
        iconURL: 'https://cdn.discordapp.com/emojis/891623735822549002.png',
      };
      color = userVip.type.id === 'developer' ? Colors.Red : Colors.Gold;
    }
    if (footer) {
      embed.setFooter(footer);
    }
    embed.setColor(color);

    return embed;
  }

  buildErrorEmbed(data: { title?: string; message?: string; variables?: Record<string, string> }) {
    const { title, message, variables } = data;
    const locale = this.requestClsService.getUserLang();

    return new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(this.localizationAdapter.getTranslation(title || 'app.errors.internal_error', locale, variables || {}))
      .setDescription(
        this.localizationAdapter.getTranslation(message || 'app.errors.unknown', locale, variables || {}),
      );
  }
}
