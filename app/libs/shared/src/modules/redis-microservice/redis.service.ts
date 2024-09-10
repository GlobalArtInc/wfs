import { Injectable, Inject } from '@nestjs/common';
import { Redis as RedisClient } from 'ioredis';
import { REDIS_CLIENT } from './redis.providers';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  async set(key: string, value: string, ttl = 0): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ttl);
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }
}
