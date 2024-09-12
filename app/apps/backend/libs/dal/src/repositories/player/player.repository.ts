import { BaseRepository } from '../../base-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from './player.entity';

export class PlayerRepository extends BaseRepository<PlayerEntity> {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly repository: Repository<PlayerEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
