import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from './redis.providers';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService): RedisClient => {
        const logger = new Logger('RedisService');
        const redisClient = new Redis(configService.getOrThrow('redis'));

        redisClient.on('error', (err) => {
          logger.error('Redis error', err);
        });

        return redisClient;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisCacheModule {}
