import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DiscordBotModule } from './discord-bot.module';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(DiscordBotModule);

  await app.listen(0);
}
bootstrap();
