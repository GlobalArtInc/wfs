import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsInteractions } from './achievements.interactions';
import { HelpersModule } from '../../helpers/helpers.module';
import { UserModule } from '../../user/user.module';
import { SettingModule } from '../../setting/setting.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';

@Module({
  imports: [HelpersModule, SharedModule, DiscordTranslationModule, UserModule, SettingModule],
  providers: [AchievementsInteractions, AchievementsService],
})
export class AchievementsModule {}
