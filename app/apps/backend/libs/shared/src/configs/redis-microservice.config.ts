import { registerAs } from '@nestjs/config';
import { Transport, type RedisOptions } from '@nestjs/microservices';

export const REDIS_PROVIDER = 'REDIS_PROVIDER';

export default registerAs<RedisOptions>('redis-microservice', () => ({
  transport: Transport.REDIS,
  name: REDIS_PROVIDER,
  options: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    db: +process.env.REDIS_CACHE_DATABASE,
    retryAttempts: Infinity,
    connectTimeout: 1000,
    commandTimeout: 1000,
  },
}));
