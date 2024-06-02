import { PlayerStatRepository } from '@app/dal/repositories/player';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TopService {
  constructor(private readonly playerStatRepository: PlayerStatRepository) {}

  async topMission(mission: string) {
    let won: string;
    let lost: string;

    if (mission === 'mars') {
      won = '[complexity]hard [mission_type]marshard [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]marshard [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'heist') {
      won = '[complexity]survival [mission_type]heist [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]survival [mission_type]heist [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'swarm') {
      won = '[complexity]survival [mission_type]swarm [mode]PVE [season] [stat]player_sessions_won ';
      lost = '[complexity]survival [mission_type]swarm [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'hydra') {
      won = '[complexity]survival [mission_type]pve_arena [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]survival [mission_type]pve_arena [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'pripyat') {
      won = '[complexity]hard [mission_type]chernobylhard [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]chernobylhard [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'sunrise') {
      won = '[complexity]hard [mission_type]japanhard [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]japanhard [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'icebreaker') {
      won = '[complexity]hard [mission_type]icebreakerhard [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]icebreakerhard [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'anubis') {
      won = '[complexity]hard [mission_type]anubishard [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]anubishard [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'blackout') {
      won = '[complexity]hard [mission_type]anubishard2 [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]anubishard2 [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'cyber_horde') {
      won = '[complexity]hard [mission_type]zombiehard [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]zombiehard [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'earth_shaker') {
      won = '[complexity]hard [mission_type]volcanohard [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]volcanohard [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'white_shark') {
      won = '[complexity]survival [mission_type]survivalmission [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]survival [mission_type]survivalmission [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'black_shark') {
      won = '[complexity]hard [mission_type]zombietowerhard [mode]pve [season] [stat]player_sessions_won';
      lost = '[complexity]hard [mission_type]zombietowerhard [mode]PVE [season] [stat]player_sessions_lost';
    } else if (mission === 'blackwood') {
      won = '[complexity]survival [mission_type]blackwood [mode]PVE [season] [stat]player_sessions_won';
      lost = '[complexity]survival [mission_type]blackwood [mode]PVE [season] [stat]player_sessions_lost';
    } else {
      throw new NotFoundException('mission_not_found');
    }

    const items = await this.playerStatRepository
      .createQueryBuilder('player_stat')
      .select('player.id')
      .addSelect('player.rank_id, player.nickname, player.clan_name')
      .addSelect(`sum(case when param = '${won}' then value else 0 end)`, 'won')
      .addSelect(`sum(case when param = '${lost}' then value else 0 end)`, 'lost')
      .where(`param IN ('${won}', '${lost}')`)
      .leftJoin('player', 'player', 'player_stat.player_id = player.id')
      .orderBy('won', 'DESC')
      .groupBy('player.id')
      .limit(50)
      // .where('user.type NOT IN (:...types)', { types: [ 'nickname_changed' ] })
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
