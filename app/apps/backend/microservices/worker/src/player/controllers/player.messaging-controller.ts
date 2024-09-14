import { Controller } from '@nestjs/common';
import { PlayerService } from '../player.service';
import { EventPattern, Transport } from '@nestjs/microservices';
import { WarfaceApiSavePlayerData } from '@app/infrastructure/apis/warface/warface-api.types';
import { PLAYER_SAVE_REDIS_COMMAND } from '@app/shared/constants';

@Controller()
export class PlayerMessagingController {
  constructor(private playerService: PlayerService) {}

  @EventPattern(PLAYER_SAVE_REDIS_COMMAND, Transport.REDIS)
  async emitSavePlayerData(message: WarfaceApiSavePlayerData) {
    await this.playerService.handlePlayerDataUpdate(message);
  }
}
