import { NestFactory } from '@nestjs/core';
import { DiscordBotModule } from './discord-bot.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import 'reflect-metadata';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(DiscordBotModule);

  await app.listen(0);
}
bootstrap();
