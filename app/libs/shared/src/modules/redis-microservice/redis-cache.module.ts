import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisCacheService } from './redis.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          sentinels: [
            {
              host: process.env.REDIS_SENTINEL_HOST,
              port: +process.env.REDIS_SENTINEL_PORT,
            },
          ],
          name: process.env.REDIS_SENTINEL_MASTER_NAME,
          db: +process.env.REDIS_CACHE_DATABASE,
        }),
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService, CacheModule],
})
export class RedisCacheModule {}
