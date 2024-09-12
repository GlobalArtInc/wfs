import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './api.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ErrorLoggingInterceptor } from './interceptors/error-logging.interceptor';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(ApiModule);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ErrorLoggingInterceptor());
  
  app.setGlobalPrefix('/api');
  app.connectMicroservice<MicroserviceOptions>(configService.getOrThrow('redis-microservice'));

  const config = new DocumentBuilder().setTitle('WFS API').setDescription('wfs methods').setVersion('2.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/api/docs`, app, document);
  SwaggerModule.setup(`/docs`, app, document);

  await app.listen(80);
  await app.startAllMicroservices().catch((err) => console.error(err));
}
bootstrap();
