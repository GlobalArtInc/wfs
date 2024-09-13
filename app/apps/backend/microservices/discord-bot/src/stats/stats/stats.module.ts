import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsInteractions } from './stats.interactions';
import { HelpersModule } from '../../helpers/helpers.module';
import { UserModule } from '../../user/user.module';
import { SettingModule } from '../../setting/setting.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';

@Module({
  imports: [SharedModule, HelpersModule, DiscordTranslationModule, SettingModule, UserModule],
  providers: [StatsInteractions, StatsService],
})
export class StatsModule {}
