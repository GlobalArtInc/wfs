import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WorkerModule } from './worker.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import 'reflect-metadata';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(WorkerModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>(configService.getOrThrow('redis-microservice'));

  await app.listen(0);
  await app.startAllMicroservices().catch((err) => console.error(err));
}
bootstrap();
