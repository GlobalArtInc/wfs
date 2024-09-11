import { Injectable, Inject } from '@nestjs/common';
import { Redis as RedisClient } from 'ioredis';
import { REDIS_CLIENT } from './redis.providers';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClient) {}

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }
}
