import { MISSIONS } from '@app/shared/constants';
import { StringOption, localizationMapByKey } from '@globalart/nestcord';

export class AchievementsDto {
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

  @StringOption({
    name: 'nickname',
    description: 'Player name',
    required: false,
    name_localizations: localizationMapByKey('app.chatCommands.options.nickname.name'),
    description_localizations: localizationMapByKey('app.chatCommands.options.nickname.desc'),
  })
  name: string;
}
