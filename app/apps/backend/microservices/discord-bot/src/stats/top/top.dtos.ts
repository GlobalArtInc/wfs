import { MISSIONS } from '@app/shared/constants';
import { StringOption, localizationMapByKey } from '@globalart/nestcord';

export class TopCommandOptions {
  @StringOption({
    name: 'mission',
    description: 'Mission name',
    required: true,
    name_localizations: localizationMapByKey('app.chatCommands.options.mission.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.mission.desc'),
    choices: MISSIONS.map((mission) => ({
      name: mission.value,
      name_localizations: localizationMapByKey(`app.${mission.name}`),
      value: mission.value,
    })),
  })
  mission: string;
}
