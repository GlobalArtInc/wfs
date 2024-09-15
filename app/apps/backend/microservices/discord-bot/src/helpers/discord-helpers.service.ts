import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Colors, EmbedBuilder, EmbedData } from 'discord.js';
import { DefaultLocalizationAdapter, LOCALIZATION_ADAPTER, NestcordService } from '@globalart/nestcord';
import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class DiscordHelpersService {
  constructor(
    private readonly translationService: TranslationService,
    private readonly requestClsService: RequestClsService,
    private readonly userService: UserService,
    private nestcordService: NestcordService,
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
        text: [this.translationService.get('app.footer.vip'), data?.footer?.text ?? ''].filter(Boolean).join('\r\n'),
        iconURL: this.nestcordService.getApplicationEmoji('wfs_vip')?.imageURL(),
      };
      color = userVip.type.id === 'developer' ? Colors.Red : Colors.Gold;
    } else {
      footer = {
        text: data?.footer?.text ?? null,
      };
    }    

    if (footer) {
      embed.setFooter(footer);
    }
    embed.setColor(color);

    if (data.description) {
      embed.setDescription(data.description);
    }
    if (data.fields?.length) {
      embed.addFields(...data.fields);
    }

    return embed;
  }

  buildErrorEmbed(data: { title?: string; message?: string; variables?: Record<string, string> }) {
    const { title, message, variables } = data;
    const locale = this.requestClsService.getUserLang();

    return new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(this.translationService.get(title || 'app.errors.internal_error', variables || {}))
      .setDescription(this.translationService.get(message || 'app.errors.unknown', variables || {}));
  }
}
