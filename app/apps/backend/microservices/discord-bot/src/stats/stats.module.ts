import { Module } from '@nestjs/common';
import { ClanModule } from './clan/clan.module';
import { SpecModule } from './spec/spec.module';
import { AchievementsModule } from './achievements/achievements.module';
import { TopModule } from './top/top.module';
import { StatsModule as StatsCommand } from './stats/stats.module';

@Module({
  imports: [ClanModule, SpecModule, AchievementsModule, TopModule, StatsCommand],
})
export class StatsModule {}
