import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';

@Module({
  imports: [SharedModule],
  providers: [AchievementService],
  controllers: [AchievementController],
})
export class AchievementModule {}
