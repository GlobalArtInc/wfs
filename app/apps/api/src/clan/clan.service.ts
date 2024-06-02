import { Injectable, NotFoundException } from '@nestjs/common';
import { ClanEntity, ClanRepository } from '@app/dal/repositories/clan';
import { WarfaceApiService } from '@app/infrastructure/apis/warface/warface.api.service';
import { WarfaceApiClan, WarfaceApiClanMember } from '@app/infrastructure/apis/warface/warface-api.types';
import * as moment from 'moment';

@Injectable()
export class ClanService {
  private readonly servers = ['ru', 'int'];

  constructor(
    private readonly clanRepository: ClanRepository,
    private readonly warfaceApiService: WarfaceApiService,
  ) {}

  async getByName(name: string) {
    const clan = await this.getClanFromRepository(name);
    if (clan && this.isRecentlyUpdated(clan.updatedAt)) {
      return this.formatClanResponse(clan);
    }

    return await this.searchAndUpdateClan(name);
  }

  private async getClanFromRepository(name: string) {
    return this.clanRepository.getOneBy({ name }, { relations: ['members'] });
  }

  private isRecentlyUpdated(updatedAt: Date): boolean {
    return moment().isBefore(moment(updatedAt).add(2, 'minutes'));
  }

  private formatClanResponse(clan: ClanEntity) {
    const { id, server, name, members, updatedAt, createdAt } = clan;
    return [
      {
        server,
        state: {
          createdAt,
          updatedAt,
        },
        data: {
          id,
          name,
          members,
        },
      },
    ];
  }

  private async searchAndUpdateClan(name: string) {
    for (const server of this.servers) {
      const [apiClan, savedClan] = await Promise.all([
        this.warfaceApiService.getClan(server, name),
        this.clanRepository.getOneBy({ name }),
      ]);

      if (apiClan.id) {
        await this.updateClan(apiClan, savedClan, server);
        return this.formatClanResponse({
          ...apiClan,
          server,
          createdAt: savedClan?.createdAt || moment().toDate(),
          updatedAt: moment().toDate(),
        });
      }
    }
    throw new NotFoundException({ message: `Клан «${name}» не найден.` });
  }

  private async updateClan(apiClan: WarfaceApiClan, savedClan: ClanEntity, server: string) {
    const clanMembers = apiClan.members.map((member: WarfaceApiClanMember) => ({
      clanId: savedClan?.clanId,
      nickname: member.nickname,
      rankId: member.rank_id,
      clanPoints: member.clan_points,
      clanRole: member.clan_role,
    }));

    await this.clanRepository.upsert({
      id: apiClan.id,
      clanId: savedClan?.clanId,
      server,
      name: apiClan.name,
      members: clanMembers,
    });
  }
}
