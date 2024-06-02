import {
  Button,
  ButtonContext,
  ComponentParam,
  Context,
  NestCordPaginationService,
  SlashCommand,
  SlashCommandContext,
  localizationMapByKey,
} from '@globalart/nestcord';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PageEnum } from './help.enums';
import { GeneralHelpService } from './help.service';

@Injectable()
export class GeneralHelpInteractions implements OnModuleInit {
  constructor(
    private readonly generalHelpService: GeneralHelpService,
    private readonly paginationService: NestCordPaginationService,
  ) {}

  public onModuleInit(): void {
    this.paginationService.register((builder) => builder.setCustomId('help'));
  }

  @SlashCommand({
    name: 'help',
    description: 'Get help',
    nameLocalizations: localizationMapByKey('app.chatCommands.help.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.help.desc'),
  })
  async execute(@Context() [interaction]: SlashCommandContext) {
    const pagination = this.paginationService.get('help');
    pagination.setButtons(this.generalHelpService.setButtons(interaction));
    pagination.setPages(await this.generalHelpService.setPages(interaction));
    const pageData = await pagination.build();

    return interaction.reply(pageData);
  }

  @Button('nestcord-pagination/help/:page')
  async onPageInteraction(@Context() [interaction]: ButtonContext, @ComponentParam('page') pageName: any) {
    const pagination = this.paginationService.get('help');
    const pageIndex = PageEnum[pageName.toUpperCase()];
    pagination.setButtons(this.generalHelpService.setButtons(interaction));
    pagination.setPages(await this.generalHelpService.setPages(interaction));
    const pageData = await pagination.build(pageIndex as any);

    return interaction.update(pageData);
  }
}
