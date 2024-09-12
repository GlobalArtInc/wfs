import { Controller } from '@nestjs/common';
import { EventPattern, Transport } from '@nestjs/microservices';
import { ClanService } from '../clan.service';
import { ClanEntity } from '@app/dal/repositories/clan';
import { WarfaceApiClan } from '@app/infrastructure/apis/warface/warface-api.types';
import { CLAN_SAVE_REDIS_COMMAND } from '@app/shared/constants/redis.constants';

@Controller()
export class ClanMessagingController {
  constructor(private clanService: ClanService) {}

  @EventPattern(CLAN_SAVE_REDIS_COMMAND, Transport.REDIS)
  async emitSaveClanData(message: { apiClan: WarfaceApiClan; clanEntity: ClanEntity; server: string }) {
    await this.clanService.emitSaveClanData(message);
  }
}
