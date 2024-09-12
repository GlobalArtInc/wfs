import { BaseRepository } from '../../base-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuildEntity } from './guild.entity';

export class GuildRepository extends BaseRepository<GuildEntity> {
  constructor(
    @InjectRepository(GuildEntity)
    private readonly repository: Repository<GuildEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
