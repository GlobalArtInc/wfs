import { ConfigService } from '@nestjs/config';

import { LangEnum } from '../enums';
import { ITranslatorOptions } from '../modules/class-translator';

export const classTranslatorModuleConfig = {
  useFactory: async (configService: ConfigService): Promise<ITranslatorOptions> => ({
    defaultLang: configService.getOrThrow<LangEnum>('common.defaultLang'),
    langEnum: LangEnum,
    defaultTranslation: false,
    remoteDicts: [
      { projectId: +process.env.TRANSLATOR_BOT_PROJECT_ID, prefix: 'app', url: process.env.REMOTE_DICTS_BOT_URL },
      {
        projectId: +process.env.TRANSLATOR_ACHIEVEMENT_PROJECT_ID,
        prefix: 'achievement',
        url: process.env.REMOTE_DICTS_ACHIEVEMENTS_URL,
      },
    ],
  }),
  inject: [ConfigService],
};
