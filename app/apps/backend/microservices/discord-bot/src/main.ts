import { EnvEnum } from '@app/shared/enums';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DiscordBotModule } from './discord-bot.module';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(DiscordBotModule);
  app.setGlobalPrefix('/api');

  await app.listen(process.env.DEPLOY_ENV === EnvEnum.DEV ? 0 : 3000);
}
bootstrap();
