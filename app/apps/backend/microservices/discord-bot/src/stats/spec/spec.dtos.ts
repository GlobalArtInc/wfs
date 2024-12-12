import { StringOption, localizationMapByKey } from '@globalart/nestcord';

export class SpecSearchDto {
  @StringOption({
    name: 'nickname',
    description: 'Player name',
    required: false,
    autocomplete: true,
    name_localizations: localizationMapByKey('app.chatCommands.options.nickname.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.nickname.desc'),
  })
  name: string;
}
