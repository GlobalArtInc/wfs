import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs(
  'redis',
  (): Record<string, unknown> => ({
    db: +process.env.REDIS_CACHE_DATABASE,
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  }),
);
