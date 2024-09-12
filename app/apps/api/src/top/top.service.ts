import { PlayerStatRepository } from '@app/dal/repositories/player';
import { MissionEnum } from '@app/shared/enums/mission.enums';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TopService {
  constructor(private readonly playerStatRepository: PlayerStatRepository) {}

  private getMissionStats(mission: MissionEnum) {
    const missionStats: Record<string, { won: string; lost: string }> = {
      [MissionEnum.MARS]: {
        won: '[complexity]hard [mission_type]marshard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]marshard [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.HEIST]: {
        won: '[complexity]survival [mission_type]heist [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]survival [mission_type]heist [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.SWARM]: {
        won: '[complexity]survival [mission_type]swarm [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]survival [mission_type]swarm [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.HYDRA]: {
        won: '[complexity]survival [mission_type]pve_arena [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]survival [mission_type]pve_arena [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.PRIPYAT]: {
        won: '[complexity]hard [mission_type]chernobylhard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]chernobylhard [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.SUNRISE]: {
        won: '[complexity]hard [mission_type]japanhard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]japanhard [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.ICEBREAKER]: {
        won: '[complexity]hard [mission_type]icebreakerhard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]icebreakerhard [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.ANUBIS]: {
        won: '[complexity]hard [mission_type]anubishard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]anubishard [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.BLACKOUT]: {
        won: '[complexity]hard [mission_type]anubishard2 [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]anubishard2 [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.CYBER_HORDE]: {
        won: '[complexity]hard [mission_type]zombiehard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]zombiehard [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.EARTH_SHAKER]: {
        won: '[complexity]hard [mission_type]volcanohard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]volcanohard [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.THE_HQ]: {
        won: '[complexity]survival [mission_type]survivalmission [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]survival [mission_type]survivalmission [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.BLACK_SHARK]: {
        won: '[complexity]hard [mission_type]zombietowerhard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]zombietowerhard [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.BLACKWOOD]: {
        won: '[complexity]survival [mission_type]blackwood [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]survival [mission_type]blackwood [mode]PVE [season] [stat]player_sessions_lost',
      },
      [MissionEnum.MIDGARD]: {
        won: '[complexity]hard [mission_type]midgardhard [mode]PVE [season] [stat]player_sessions_won',
        lost: '[complexity]hard [mission_type]midgardhard [mode]PVE [season] [stat]player_sessions_lost',
      },
    };

    const stats = missionStats[mission];
    if (!stats) {
      throw new NotFoundException('mission_not_found');
    }
    return stats;
  }

  async topMission(mission: string) {
    const missionEnum = MissionEnum[mission.toUpperCase() as keyof typeof MissionEnum];

    const { won, lost } = this.getMissionStats(missionEnum);

    const items = await this.playerStatRepository
      .createQueryBuilder('player_stat')
      .select('player.id')
      .addSelect('player.rank_id, player.nickname, player.clan_name')
      .addSelect(`sum(case when param = '${won}' then value else 0 end)`, 'won')
      .addSelect(`sum(case when param = '${lost}' then value else 0 end)`, 'lost')
      .where('param = :won OR param = :lost', { won, lost })
      .leftJoin('player', 'player', 'player_stat.player_id = player.id')
      .orderBy('won', 'DESC')
      .groupBy('player.id')
      .limit(50)
      .execute();

    return {
      mission,
      items,
    };
  }

  async getByMission(name: string) {
    return this.topMission(name);
  }
}
