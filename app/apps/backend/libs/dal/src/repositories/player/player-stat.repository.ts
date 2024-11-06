import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base-repository';
import { PlayerStatEntity } from './player.entity';

// @ts-ignore
export class PlayerStatRepository extends BaseRepository<PlayerStatEntity> {
  constructor(
    @InjectRepository(PlayerStatEntity)
    private readonly repository: Repository<PlayerStatEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
