import { Module, Global, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService): RedisClient => {
        return new Redis(configService.getOrThrow('redis'));
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisCacheModule {}
