import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BaseRepository } from '../../base-repository';
import { UserEntity } from './user.entity';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager);
  }

  async getOne(userId: string, client: string) {
    return this.repository.findOne({ where: { id: userId, client }, relations: ['usersPlayers', 'usersClans'] });
  }

  async updateOne(userId: string, client: string, patchData: DeepPartial<UserEntity>) {
    await this.repository.update({ id: userId, client }, patchData);
  }
}
