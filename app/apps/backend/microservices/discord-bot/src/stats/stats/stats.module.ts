import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { SettingModule } from '../../setting/setting.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';
import { UserModule } from '../../user/user.module';
import { StatsInteractions } from './stats.interactions';
import { StatsService } from './stats.service';

@Module({
  imports: [SharedModule, HelpersModule, DiscordTranslationModule, SettingModule, UserModule],
  providers: [StatsInteractions, StatsService],
})
export class StatsModule {}
