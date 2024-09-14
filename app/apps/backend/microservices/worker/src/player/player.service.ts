import { Injectable, Logger } from '@nestjs/common';
import {
  PlayerAchievementEntity,
  PlayerEntity,
  PlayerRepository,
  PlayerStatRepository,
} from '@app/dal/repositories/player';
import { PlayerTypeEnum } from '@app/dal/repositories/player/player.enums';
import { WarfaceApiAchievement, WarfaceApiSavePlayerData } from '@app/infrastructure/apis/warface/warface-api.types';
import * as moment from 'moment';
import { PlayerAchievementRepository } from '@app/dal/repositories/player/player-achievement.repository';

@Injectable()
export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly playerStatRepository: PlayerStatRepository,
    private readonly playerAchievementRepository: PlayerAchievementRepository,
  ) {}
  private readonly logger = new Logger(PlayerService.name);

  public async handlePlayerDataUpdate(data: WarfaceApiSavePlayerData) {
    this.logger.log(`start to update player ${data.player.nickname}`);
    const playerData = this.extractPlayerData(data.player);

    await this.playerRepository.upsert({
      id: data.playerId,
      type: PlayerTypeEnum.Open,
      server: data.server,
      ...playerData,
    });

    await Promise.all([
      this.updatePlayerStats(data.playerId, data.fullPlayer),
      this.updatePlayerAchievements(data.playerId, data.achievements),
    ]);
    this.logger.log(`end to update player ${data.player.nickname}`);
  }

  private extractPlayerData(player: Record<string, any>): Record<keyof PlayerEntity, any> {
    return Object.entries(player).reduce((acc: any, [key, value]) => {
      if (!['full_response', 'is_transparent'].includes(key)) acc[key] = value ?? 0;
      return acc;
    }, {}) as Record<keyof PlayerEntity, unknown>;
  }

  private async updatePlayerStats(playerId: string, fullPlayerStats: Record<string, number>) {
    const existingPlayerStats = await this.playerStatRepository.getManyBy({ playerId });
    const newPlayerStatsArray = this.convertPlayerStatsToArray(fullPlayerStats);

    const statsToUpdate = this.getChangedStats(existingPlayerStats, newPlayerStatsArray).map((stat) =>
      this.playerStatRepository.upsert({
        playerId,
        param: stat.param,
        value: stat.value,
        id: null,
      }),
    );

    return statsToUpdate;
  }

  private async updatePlayerAchievements(playerId: string, playerAchievements: WarfaceApiAchievement[]) {
    const existingPlayerAchievements = await this.playerAchievementRepository.getManyBy({ playerId });

    const achievementsToUpdate = this.getChangedAchievements(existingPlayerAchievements, playerAchievements).map(
      (achievement) =>
        this.playerAchievementRepository.upsert({
          id: null,
          playerId,
          achievement_id: achievement.achievement_id,
          completion_time: achievement.completion_time,
          progress: achievement.progress,
        }),
    );

    return achievementsToUpdate;
  }

  private getChangedStats(
    existingStats: Array<{ param: string; value: number }>,
    newStats: Array<{ param: string; value: number }>,
  ) {
    return newStats.filter((newStat) => {
      const existingStat = existingStats.find((stat) => stat.param === newStat.param);
      return existingStat ? +existingStat.value !== +newStat.value : true;
    });
  }

  private getChangedAchievements(
    existingAchievements: PlayerAchievementEntity[],
    newAchievements: WarfaceApiAchievement[],
  ) {
    return newAchievements.filter((newAchievement) => {
      const existingAchievement = existingAchievements.find(
        (achievement) => achievement.achievement_id === newAchievement.achievement_id,
      );

      return existingAchievement ? +newAchievement.progress !== +existingAchievement.progress : true;
    });
  }

  private convertPlayerStatsToArray(fullPlayerStats: Record<string, number>) {
    return Object.entries(fullPlayerStats).map(([param, value]) => ({ param, value }));
  }
}
