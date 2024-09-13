import { Injectable, UseInterceptors } from '@nestjs/common';
import { StatsService } from './stats.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import {
  Button,
  ButtonContext,
  ComponentParam,
  Context,
  CurrentTranslate,
  DeferCommandInterceptor,
  NestCordPaginationService,
  Options,
  PaginatorTypeEnum,
  SlashCommand,
  SlashCommandContext,
  TranslationFn,
  localizationMapByKey,
} from '@globalart/nestcord';
import { StatsCommandOptions } from './stats.dtos';
import { PageEnum } from './stats.enums';
import { UserService } from '../../user/user.service';

@Injectable()
export class StatsInteractions {
  constructor(
    private readonly statsService: StatsService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly paginationService: NestCordPaginationService,
    private readonly userService: UserService,
  ) {}

  public onModuleInit(): void {
    this.paginationService.register(PaginatorTypeEnum.BUTTONS, (builder) => builder.setCustomId('stats'));
  }

  @UseInterceptors(DeferCommandInterceptor)
  @SlashCommand({
    name: 'stats',
    description: 'Get player stats',
    nameLocalizations: localizationMapByKey('app.chatCommands.stats.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.stats.desc'),
  })
  async execute(
    @Options() { name }: StatsCommandOptions,
    @Context() [interaction]: SlashCommandContext,
    @CurrentTranslate() trans: TranslationFn,
  ) {
    try {
      const pagination = this.paginationService.get<PaginatorTypeEnum.BUTTONS>('stats');
      const playerName = name || (await this.userService.getLinkedPlayer(interaction.user.id));
      pagination.setButtons(this.statsService.setButtons(interaction, playerName));
      pagination.setPages(await this.statsService.createEmbed(name, trans));
      const pageData = await pagination.build(1);

      return interaction.followUp(pageData);
    } catch (err) {
      console.log(err);
      const errorEmbed = this.discordHelpersService.buildErrorEmbed({
        message:
          err?.response?.discordMessage ||
          (err?.response?.code ? `app.errors.${err.response.code}` : 'app.errors.unknown'),
        variables: { name },
      });
      return interaction.followUp({
        embeds: [errorEmbed],
      });
    }
  }

  @Button('nestcord-pagination/stats/:page/:playerName')
  async onPageInteraction(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('page') pageName: any,
    @ComponentParam('playerName') playerName: string,
    @CurrentTranslate() trans: TranslationFn,
  ) {
    await interaction.deferReply();
    const pagination = this.paginationService.get<PaginatorTypeEnum.BUTTONS>('stats');
    const pageIndex = PageEnum[pageName.toUpperCase()];
    pagination.setButtons(this.statsService.setButtons(interaction as any, playerName));
    pagination.setPages(await this.statsService.createEmbed(playerName, trans));
    const pageData = await pagination.build(pageIndex as any);

    return Promise.all([interaction.message.delete(), interaction.editReply(pageData)]);
  }
}
