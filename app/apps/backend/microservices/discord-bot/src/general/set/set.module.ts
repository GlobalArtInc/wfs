import { Module } from '@nestjs/common';
import { SetService } from './set.service';
import { SetInteractions } from './set.interactions';
import { HelpersModule } from '../../helpers/helpers.module';
import { SettingModule } from '../../setting/setting.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';

@Module({
  imports: [SharedModule, HelpersModule, DiscordTranslationModule, SettingModule],
  providers: [SetInteractions, SetService],
})
export class SetModule {}
