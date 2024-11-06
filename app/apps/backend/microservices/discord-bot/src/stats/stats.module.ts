import { Module } from '@nestjs/common';
import { AchievementsModule } from './achievements/achievements.module';
import { ClanModule } from './clan/clan.module';
import { SpecModule } from './spec/spec.module';
import { StatsModule as StatsCommand } from './stats/stats.module';
import { TopModule } from './top/top.module';

@Module({
  imports: [ClanModule, SpecModule, AchievementsModule, TopModule, StatsCommand],
})
export class StatsModule {}
