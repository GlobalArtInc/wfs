import { WarfaceApiService } from '@app/infrastructure/apis/warface/warface.api.service';
import { RedisCacheService } from '@app/shared/modules/redis-microservice/redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AchievementService {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly warfaceApiService: WarfaceApiService,
  ) {}

  private readonly achievementRedisKey = 'achievements_catalog';

  async getAllAchievements() {
    const savedAchievements = await this.redisService.get(this.achievementRedisKey);
    if (savedAchievements) {
      return savedAchievements;
    }

    const achievements = await this.warfaceApiService.getAllAchievements();
    await this.redisService.set(this.achievementRedisKey, achievements, 120);

    return achievements;
  }
}
