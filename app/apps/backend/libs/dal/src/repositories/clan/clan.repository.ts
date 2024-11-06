import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base-repository';
import { ClanEntity } from './clan.entity';

export class ClanRepository extends BaseRepository<ClanEntity> {
  constructor(
    @InjectRepository(ClanEntity)
    private readonly repository: Repository<ClanEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
