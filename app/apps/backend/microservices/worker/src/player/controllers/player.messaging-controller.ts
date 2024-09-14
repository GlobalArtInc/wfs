import { Controller } from '@nestjs/common';
import { PlayerService } from '../player.service';
import { EventPattern, Transport } from '@nestjs/microservices';
import { WarfaceApiSavePlayerData } from '@app/infrastructure/apis/warface/warface-api.types';
import { PLAYER_SAVE_REDIS_COMMAND, PLAYER_UPDATE_STATUS_COMMAND } from '@app/shared/constants';
import { PlayerTypeEnum } from '@app/dal/repositories/player/player.enums';

@Controller()
export class PlayerMessagingController {
  constructor(private playerService: PlayerService) {}

  @EventPattern(PLAYER_SAVE_REDIS_COMMAND, Transport.REDIS)
  async emitSavePlayerData(message: WarfaceApiSavePlayerData) {
    await this.playerService.handlePlayerDataUpdate(message);
  }

  @EventPattern(PLAYER_UPDATE_STATUS_COMMAND, Transport.REDIS)
  async updatePlayerStatus(message: { playerId: string; status: PlayerTypeEnum }) {
    await this.playerService.handlePlayerStatusUpdate(message);
  }
}
