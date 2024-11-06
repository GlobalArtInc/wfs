import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../base-repository';
import { ServerEntity } from './server.entity';

export class ServerRepository extends BaseRepository<ServerEntity> {
  constructor(
    @InjectRepository(ServerEntity)
    private readonly repository: Repository<ServerEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
