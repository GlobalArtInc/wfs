import { BaseRepository } from '../../base-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerAchievementEntity, PlayerStatEntity } from './player.entity';

// @ts-ignore
export class PlayerAchievementRepository extends BaseRepository<PlayerAchievementEntity> {
  constructor(
    @InjectRepository(PlayerAchievementEntity)
    private readonly repository: Repository<PlayerAchievementEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
