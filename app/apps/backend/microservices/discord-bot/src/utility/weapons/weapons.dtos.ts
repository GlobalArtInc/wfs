import { StringOption, localizationMapByKey } from '@globalart/nestcord';

export class WeaponsInteractionDto {
  @StringOption({
    name: 'name',
    description: 'Retrieve detailed information about weapons',
    name_localizations: localizationMapByKey('app.chatCommands.options.weapons.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.weapons.desc'),
    required: true,
  })
  name: string;
}
