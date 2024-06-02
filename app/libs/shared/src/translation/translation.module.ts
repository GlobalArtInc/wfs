import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { TranslationMessagingController } from './translation.messaging-controller';
import { ClassTranslatorModule } from '../modules/class-translator';
import { classTranslatorModuleConfig } from '../configs/class-translator.config';
import { REDIS_PROVIDER } from '../configs/redis-microservice.config';

const redisClientModule = ClientsModule.registerAsync([
  {
    name: REDIS_PROVIDER,
    useFactory: (configService: ConfigService) => configService.get('redis-microservice'),
    inject: [ConfigService],
  },
]);

@Module({
  imports: [redisClientModule, ClassTranslatorModule.forRootAsync(classTranslatorModuleConfig)],
  controllers: [TranslationMessagingController],
})
export class TranslationModule {}
