import { SharedModule } from '@app/shared/modules/shared.module';
import { NestCordPaginationModule } from '@globalart/nestcord';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';
import { GeneralOnlineInteractions } from './online.interactions';
import { GeneralOnlineService } from './online.service';

@Module({
  imports: [NestCordPaginationModule.forRoot(), SharedModule, DiscordTranslationModule, HelpersModule],
  providers: [GeneralOnlineInteractions, GeneralOnlineService],
})
export class GeneralOnlineModule {}
