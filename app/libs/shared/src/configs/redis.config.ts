import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const redisConfig = registerAs(
  'redis',
  (): RedisOptions => ({
    db: +process.env.REDIS_CACHE_DATABASE,
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    connectTimeout: 1000,
    commandTimeout: 1000,
  }),
);
