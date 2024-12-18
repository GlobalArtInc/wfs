import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base-repository';
import { VipEntity } from './vip.entity';

export class VipRepository extends BaseRepository<VipEntity> {
  constructor(
    @InjectRepository(VipEntity)
    private readonly repository: Repository<VipEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
