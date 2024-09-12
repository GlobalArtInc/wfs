import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs(
  'redis',
  (): Record<string, unknown> => ({
    sentinels: [{ host: process.env.REDIS_SENTINEL_HOST, port: +process.env.REDIS_SENTINEL_PORT }],
    name: process.env.REDIS_SENTINEL_MASTER_NAME,
    db: +process.env.REDIS_CACHE_DATABASE,
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  }),
);
