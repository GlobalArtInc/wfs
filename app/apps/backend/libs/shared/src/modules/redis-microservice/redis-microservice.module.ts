import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { REDIS_PROVIDER } from '@app/shared/configs/redis-microservice.config';

const redisClientModule = ClientsModule.registerAsync([
  {
    name: REDIS_PROVIDER,
    useFactory: (configService: ConfigService) => configService.get('redis-microservice'),
    inject: [ConfigService],
  },
]);

@Module({
  imports: [redisClientModule],
  exports: [redisClientModule],
})
export class RedisMicroserviceModule {}
