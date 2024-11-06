import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { SettingModule } from '../../setting/setting.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';
import { SetInteractions } from './set.interactions';
import { SetService } from './set.service';

@Module({
  imports: [SharedModule, HelpersModule, DiscordTranslationModule, SettingModule],
  providers: [SetInteractions, SetService],
})
export class SetModule {}
