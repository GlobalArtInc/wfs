import { StringOption, localizationMapByKey } from '@globalart/nestcord';

export class SpecSearchDto {
  @StringOption({
    name: 'nickname',
    description: 'Player name',
    required: false,
    name_localizations: localizationMapByKey('app.chatCommands.options.nickname.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.nickname.desc'),
  })
  name: string;
}
