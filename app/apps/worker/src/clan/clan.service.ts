import { ClanEntity, ClanRepository } from '@app/dal/repositories/clan';
import { WarfaceApiClan, WarfaceApiClanMember } from '@app/infrastructure/apis/warface/warface-api.types';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class ClanService {
  constructor(private readonly clanRepository: ClanRepository) {}

  public async emitSaveClanData(message: { apiClan: WarfaceApiClan, clanEntity: ClanEntity, server: string }) {
    const clanMembers = message.apiClan.members.map((member: WarfaceApiClanMember) => ({
      nickname: member.nickname,
      rankId: member.rank_id,
      clanPoints: member.clan_points,
      clanRole: member.clan_role,
    }));
  
    await this.clanRepository.upsert({
      id: message.apiClan.id,
      clanId: message.clanEntity?.clanId,
      server: message.server,
      name: message.apiClan.name,
      members: clanMembers,
      updatedAt: moment().toDate(),
    });
  }
}
