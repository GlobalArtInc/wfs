import { BaseRepository } from '../../base-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeaponEntity } from './weapon.entity';

export class WeaponRepository extends BaseRepository<WeaponEntity> {
  constructor(
    @InjectRepository(WeaponEntity)
    private readonly repository: Repository<WeaponEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
