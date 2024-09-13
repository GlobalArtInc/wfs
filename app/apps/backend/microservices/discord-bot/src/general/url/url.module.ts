import { Module } from '@nestjs/common';
import { GeneralUrlService } from './url.service';
import { GeneralUrlInteractions } from './url.interactions';
import { HelpersModule } from '../../helpers/helpers.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';

@Module({
  imports: [HelpersModule, DiscordTranslationModule],
  providers: [GeneralUrlInteractions, GeneralUrlService],
})
export class GeneralUrlModule {}
