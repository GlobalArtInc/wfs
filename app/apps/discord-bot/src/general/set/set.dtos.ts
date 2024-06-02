import { SERVERS } from '@app/shared/constants';
import { StringOption, localizationMapByKey } from '@globalart/nestcord';

export class SetServerOptions {
  @StringOption({
    name: 'server',
    description: 'Server name',
    name_localizations: localizationMapByKey('app.chatCommands.options.server.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.server.desc'),
    required: true,
    choices: SERVERS.map(({ name, value }) => ({
      name,
      name_localizations: localizationMapByKey(`app.${name}`),
      value,
    })),
  })
  server: string;
}

export class SetPlayerOptions {
  @StringOption({
    name: 'name',
    description: 'Player name',
    name_localizations: localizationMapByKey('app.chatCommands.options.nickname.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.nickname.desc'),
    required: true,
  })
  name: string;
}

export class SetClanOptions {
  @StringOption({
    name: 'name',
    description: 'Clan name',
    name_localizations: localizationMapByKey('app.chatCommands.options.clan.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.clan.desc'),
    required: true,
  })
  name: string;
}
