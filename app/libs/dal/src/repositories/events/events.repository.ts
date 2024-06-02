import { BaseRepository } from '../../base-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsEntity } from './events.entity';

export class EventsRepository extends BaseRepository<EventsEntity> {
  constructor(
    @InjectRepository(EventsEntity)
    private readonly repository: Repository<EventsEntity>,
  ) {
    super(repository.target, repository.manager);
  }
}
