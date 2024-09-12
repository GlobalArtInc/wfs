import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/dal/repositories/user';
import { VipRepository } from '@app/dal/repositories/vip';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly vipRepository: VipRepository,
  ) {}

  private async getLinkedEntity(discordUserId: string, entityKey: 'usersPlayers' | 'usersClans') {
    const discordUser = await this.userRepository.getOneBy(
      { id: discordUserId, client: 'discord' },
      { relations: ['usersPlayers', 'usersClans'] },
    );
    if (!discordUser) return null;
    const entity = discordUser[entityKey]?.[0];

    return entity?.name || null;
  }

  async getUser(userId: string) {
    return this.userRepository.getOneBy({ id: userId, client: 'discord' });
  }

  async userVip(userId: string) {
    const member = await this.getUser(userId);

    return this.vipRepository.getOneBy({ member }, { relations: ['type'] });
  }

  getLinkedPlayer(discordUserId: string) {
    return this.getLinkedEntity(discordUserId, 'usersPlayers');
  }

  getLinkedClan(discordUserId: string) {
    return this.getLinkedEntity(discordUserId, 'usersClans');
  }
}
