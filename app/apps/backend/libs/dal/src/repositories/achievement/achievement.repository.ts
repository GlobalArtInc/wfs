import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base-repository';
import { AchievementEntity } from './achievement.entity';

export class AchievementRepository extends BaseRepository<AchievementEntity> {
  constructor(
    @InjectRepository(AchievementEntity)
    private readonly repository: Repository<AchievementEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
