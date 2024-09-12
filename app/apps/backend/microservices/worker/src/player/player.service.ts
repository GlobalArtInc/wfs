import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '@app/dal/repositories/player';
import { PlayerTypeEnum } from '@app/dal/repositories/player/player.enums';
import { WarfaceApiSavePlayerData } from '@app/infrastructure/apis/warface/warface-api.types';
import * as moment from 'moment';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  public async emitSavePlayerData(data: WarfaceApiSavePlayerData) {
    const params = Object.entries(data.player).reduce((acc: any, [key, value]) => {
      if (!['full_response', 'is_transparent'].includes(key)) acc[key] = value ?? 0;
      return acc;
    }, {});

    await this.playerRepository.upsert({
      id: data.playerId,
      type: PlayerTypeEnum.Open,
      server: data.server,
      ...params,
      updated_at: moment().toDate(),
      playerStats: Object.entries(data.fullPlayer).map(([param, value]) => ({ param, value })),
      playerAchievements: data.achievements.map(({ achievement_id, progress, completion_time }) => ({
        achievement_id,
        progress,
        completion_time,
      })),
    });
  }
}
