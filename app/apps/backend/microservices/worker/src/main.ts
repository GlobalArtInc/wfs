import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import 'reflect-metadata';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(WorkerModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>(configService.getOrThrow('redis-microservice'));

  await app.listen(0);
  await app.startAllMicroservices().catch((err) => console.error(err));
}
bootstrap();
