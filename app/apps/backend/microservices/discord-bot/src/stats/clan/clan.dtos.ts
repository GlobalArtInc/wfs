import { StringOption, localizationMapByKey } from '@globalart/nestcord';

export class ClanSearchDto {
  @StringOption({
    name: 'name',
    description: 'Clan name',
    required: false,
    name_localizations: localizationMapByKey('app.chatCommands.options.clan.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.clan.desc'),
  })
  name: string;
}
