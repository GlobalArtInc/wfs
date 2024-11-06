import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { SettingModule } from '../../setting/setting.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';
import { UserModule } from '../../user/user.module';
import { AchievementsInteractions } from './achievements.interactions';
import { AchievementsService } from './achievements.service';

@Module({
  imports: [HelpersModule, SharedModule, DiscordTranslationModule, UserModule, SettingModule],
  providers: [AchievementsInteractions, AchievementsService],
})
export class AchievementsModule {}
