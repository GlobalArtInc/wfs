import { Module, Global, Provider } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService): Promise<RedisClientType> => {
    const client = createClient({
      url: `redis://${configService.getOrThrow('redis.host')}`,
      database: +process.env.REDIS_CACHE_DATABASE || 0,
      socket: {
        reconnectStrategy: (retries) => {
          return Math.min(retries * 200, 5000);
        },
        keepAlive: 10000,
        timeout: 20000,
      },
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('Connected to Redis');
    });

    client.on('reconnecting', () => {
      console.log('Reconnecting to Redis...');
    });

    client.on('end', () => {
      console.warn('Redis connection closed');
    });

    await client.connect();

    setInterval(async () => {
      try {
        await client.ping();
      } catch (error) {
        console.error('Redis ping failed:', error);
      }
    }, 10000);

    return client as RedisClientType;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [redisProvider],
  exports: [REDIS_CLIENT],
})
export class RedisCacheModule {}
