import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { SettingModule } from '../../setting/setting.module';
import { TranslationModule } from '../../translation/translation.module';
import { GeneralScoreInteractions } from './score.interactions';
import { GeneralScoreService } from './score.service';

@Module({
  imports: [SharedModule, SettingModule, TranslationModule, HelpersModule],
  providers: [GeneralScoreService, GeneralScoreInteractions],
})
export class GeneralScoreModule {}
