import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async get<T>(key: string): Promise<T | null> {
    return this.cacheManager.get<T>(key);
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl ? ttl * 1000 : 0);
  }

  public async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  public async resetCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
