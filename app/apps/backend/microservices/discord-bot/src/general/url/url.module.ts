import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';
import { GeneralUrlInteractions } from './url.interactions';
import { GeneralUrlService } from './url.service';

@Module({
  imports: [HelpersModule, DiscordTranslationModule],
  providers: [GeneralUrlInteractions, GeneralUrlService],
})
export class GeneralUrlModule {}
