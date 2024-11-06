import { NestCordPaginationModule } from '@globalart/nestcord';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';
import { GeneralHelpInteractions } from './help.interactions';
import { GeneralHelpService } from './help.service';

@Module({
  imports: [NestCordPaginationModule.forRoot(null), DiscordTranslationModule, HelpersModule],
  providers: [GeneralHelpInteractions, GeneralHelpService],
})
export class GeneralHelpModule {}
