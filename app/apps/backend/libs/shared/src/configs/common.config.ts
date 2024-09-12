import { registerAs } from '@nestjs/config';
import { EnvEnum } from '../enums';

export default registerAs(
  'common',
  (): Record<string, unknown> => ({
    defaultLang: 'ru_RU',
    apiUrl: process.env.API_URL,
    translatorProjectId: +process.env.TRANSLATOR_PROJECT_ID,
    isProductionableEnv: [EnvEnum.PROD].includes(process.env.DEPLOY_ENV as EnvEnum),
  }),
);
