import { Injectable } from '@nestjs/common';
import { GeneralUrlService } from './url.service';
import { SlashCommand, localizationMapByKey, Context, SlashCommandContext } from '@globalart/nestcord';
import { CommandCategoryEnum } from '@app/shared/enums';

@Injectable()
export class GeneralUrlInteractions {
  constructor(private readonly generalUrlService: GeneralUrlService) {}

  @SlashCommand({
    name: 'link',
    category: CommandCategoryEnum.GENERAL,
    description: 'Link to invite the bot',
    nameLocalizations: localizationMapByKey('app.chatCommands.link.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.link.desc'),
  })
  async execute(@Context() [interaction]: SlashCommandContext) {
    const embedData = await this.generalUrlService.createEmbed();
    const component = this.generalUrlService.component();

    return interaction.reply({ embeds: [embedData], components: [component] });
  }
}
