import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../player.service';
import { EventPattern, Transport } from '@nestjs/microservices';
import { WarfaceApiSavePlayerData } from '@app/infrastructure/apis/warface/warface-api.types';
import { PLAYER_SAVE_REDIS_COMMAND } from '@app/shared/constants/redis.constants';

@Controller()
export class PlayerMessagingController {
  constructor(private playerService: PlayerService) {}

  @EventPattern(PLAYER_SAVE_REDIS_COMMAND, Transport.REDIS)
  async savePlayerData(message: WarfaceApiSavePlayerData) {
    await this.playerService.saveData(message);
  }
}
