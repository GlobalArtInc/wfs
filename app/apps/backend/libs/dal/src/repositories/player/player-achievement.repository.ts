import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base-repository';
import { PlayerAchievementEntity } from './player.entity';

// @ts-ignore
export class PlayerAchievementRepository extends BaseRepository<PlayerAchievementEntity> {
  constructor(
    @InjectRepository(PlayerAchievementEntity)
    private readonly repository: Repository<PlayerAchievementEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
