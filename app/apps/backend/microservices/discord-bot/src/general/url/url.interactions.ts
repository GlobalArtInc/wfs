import { Injectable } from '@nestjs/common';
import { GeneralUrlService } from './url.service';
import {
  SlashCommand,
  localizationMapByKey,
  Context,
  SlashCommandContext,
  CurrentTranslate,
  TranslationFn,
} from '@globalart/nestcord';

@Injectable()
export class GeneralUrlInteractions {
  constructor(private readonly generalUrlService: GeneralUrlService) {}

  @SlashCommand({
    name: 'link',
    description: 'Link to invite the bot',
    nameLocalizations: localizationMapByKey('app.chatCommands.link.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.link.desc'),
  })
  async execute(@Context() [interaction]: SlashCommandContext, @CurrentTranslate() trans: TranslationFn) {
    const embedData = await this.generalUrlService.embed(trans);
    const component = this.generalUrlService.component(trans);

    return interaction.reply({ embeds: [embedData], components: [component] });
  }
}
