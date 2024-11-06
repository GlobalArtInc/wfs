import { CommandCategoryEnum } from '@app/shared/enums';
import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';
import {
    BaseCommandMeta,
    CommandDiscovery,
    CommandsService,
    ComponentParam,
    Context,
    NestCordPaginationService,
    PageBuilder,
    PaginatorTypeEnum,
    SelectedStrings,
    SlashCommand,
    SlashCommandContext,
    StringSelect,
    StringSelectContext,
    localizationMapByKey,
} from '@globalart/nestcord';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class GeneralHelpInteractions implements OnModuleInit {
  private readonly mainPageId = 'main_page';
  private readonly logger = new Logger(GeneralHelpInteractions.name);

  constructor(
    private readonly translatorService: TranslationService,
    private readonly discordHelperService: DiscordHelpersService,
    private readonly requestClsService: RequestClsService,
    private readonly commandsService: CommandsService,
    private readonly paginationService: NestCordPaginationService,
  ) {}

  onModuleInit(): void {
    this.paginationService.register(PaginatorTypeEnum.SELECT_MENU, (builder) => builder.setCustomId('help_command'));
  }

  @SlashCommand({
    name: 'help',
    category: CommandCategoryEnum.GENERAL,
    description: 'Get help',
    nameLocalizations: localizationMapByKey('app.chatCommands.help.name'),
    descriptionLocalizations: localizationMapByKey('app.chatCommands.help.desc'),
  })
  async execute(@Context() [interaction]: SlashCommandContext) {
    const commands = this.commandsService.getCommandsByCategoryMap();
    const pagination = this.paginationService.get<PaginatorTypeEnum.SELECT_MENU>('help_command');
    const pages = await this.createMenuPages(commands);

    pagination.setSelectMenuItems(this.createSelectItems(commands));
    pagination.setPages(pages);
    pagination.setCustomOptions(interaction.user.id);

    const page = await pagination.build(this.mainPageId);
    return interaction.reply(page);
  }

  @StringSelect('nestcord-pagination/help_command/:userId')
  async executeInteraction(
    @Context() [interaction]: StringSelectContext,
    @ComponentParam('userId') userId: string,
    @SelectedStrings() selected: string[],
  ) {
    if (interaction.user.id !== userId) {
      return interaction.reply({
        content: this.translatorService.get('app.errors.you_cant_perform_this_action'),
        ephemeral: true,
      });
    }

    const selectedItem = selected[0];
    const commands = this.commandsService.getCommandsByCategoryMap();
    const pagination = this.paginationService.get<PaginatorTypeEnum.SELECT_MENU>('help_command');
    const pages = await this.createMenuPages(commands);

    pagination.setSelectMenuItems(this.createSelectItems(commands, selectedItem));
    pagination.setPages(pages);
    pagination.setCustomOptions(interaction.user.id);

    const page = await pagination.build(selectedItem || this.mainPageId);
    return interaction.update(page);
  }

  private createSelectItems(commands: Map<string, CommandDiscovery<BaseCommandMeta>[]>, selectedItem?: string) {
    const items = Array.from(commands.keys()).map((value) => {
      const emoji = '';

      return {
        emoji: emoji || undefined,
        label: this.translatorService.get(`app.commands.category.${value}`),
        value,
        default: value === selectedItem,
      };
    });

    items.unshift({
      emoji: undefined,
      label: this.translatorService.get('app.commands.category.all'),
      value: this.mainPageId,
      default: selectedItem === this.mainPageId || !selectedItem,
    });

    return items;
  }

  private async createMenuPages(commands: Map<string, CommandDiscovery<BaseCommandMeta>[]>) {
    const fields = Array.from(commands.entries()).map(([key, value]) => ({
      name: key,
      value: value
        .map((command) =>
          command.hasSubCommands()
            ? command
                .getSubCommands()
                .map((subCommand) => `</${command.getName()} ${subCommand.getName()}:${command.getId()}>`)
                .join(' ')
            : `</${command.getName()}:${command.getId()}>`,
        )
        .join(' '),
    }));

    const embed = await this.discordHelperService.buildEmbed({
      title: this.translatorService.get('app.commands.help.title'),
      fields: fields.map((field) => {
        const emoji = '';
        const translatedCategory = this.translatorService.get(`app.commands.category.${field.name}`);

        return {
          name: `${emoji} ${translatedCategory}`,
          value: field.value,
        };
      }),
    });

    const pageBuilders = await Promise.all(
      fields.map(async (field) => {
        const groupCommands = commands.get(field.name);

        const groupEmbed = await this.discordHelperService.buildEmbed({
          title: this.translatorService.get('app.commands.help.title'),
          description: groupCommands
            .map((command) =>
              command.hasSubCommands()
                ? command
                    .getSubCommands()
                    .map(
                      (subCommand) =>
                        `</${command.getName()} ${subCommand.getName()}:${command.getId()}> - ${this.translatorService.get(`app.chatCommands.${command.getName()}_${subCommand.getName()}.desc`)}`,
                    )
                    .join('\n')
                : `</${command.getName()}:${command.getId()}> - ${this.translatorService.get(`app.chatCommands.${command.getName()}.desc`)}`,
            )
            .join('\n'),
        });

        return {
          pageId: field.name,
          builder: new PageBuilder().setEmbeds([groupEmbed]),
        };
      }),
    );

    return [
      {
        pageId: this.mainPageId,
        builder: new PageBuilder().setEmbeds([embed]),
      },
      ...pageBuilders,
    ];
  }
}
