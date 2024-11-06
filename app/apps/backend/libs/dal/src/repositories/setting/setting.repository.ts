import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base-repository';
import { SettingEntity } from './setting.entity';

export class SettingRepository extends BaseRepository<SettingEntity> {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly repository: Repository<SettingEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
