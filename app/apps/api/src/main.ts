import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './api.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import 'reflect-metadata';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(ApiModule);
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder().setTitle('WFS API').setDescription('wfs methods').setVersion('2.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/api/docs`, app, document);
  SwaggerModule.setup(`/docs`, app, document);

  await app.listen(80);
}
bootstrap();
