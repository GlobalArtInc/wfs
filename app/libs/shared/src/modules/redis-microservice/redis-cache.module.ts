import { Module, Global, Logger } from '@nestjs/common';
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
        const logger = new Logger(RedisCacheModule.name);
        const redisClient = new Redis(configService.getOrThrow('redis'));

        let isReconnecting = false;
        let pingInterval: NodeJS.Timeout;

        const reconnect = async () => {
          if (isReconnecting) return; // Avoid multiple reconnect attempts

          isReconnecting = true;
          logger.warn('Attempting to reconnect to Redis...');
          try {
            await redisClient.disconnect();
            await redisClient.connect();
          } catch (error) {
            logger.error('Redis reconnection error:', error.stack);
            setTimeout(reconnect, 5000);
          } finally {
            isReconnecting = false;
          }
        };

        const startPing = () => {
          pingInterval = setInterval(async () => {
            try {
              await redisClient.ping();
            } catch (error) {
              logger.error('Redis ping error:', error.stack);
              reconnect();
            }
          }, 10000);
        };

        redisClient.on('connect', () => {
          logger.log('Redis connected');
          startPing();
        });

        redisClient.on('error', (error) => {
          logger.error('Redis error:', error.stack);
        });

        redisClient.on('close', () => {
          if (!isReconnecting) {
            logger.warn('Redis connection closed. Reconnecting...');
            clearInterval(pingInterval);
            reconnect();
          }
        });

        return redisClient;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisCacheModule {}
