import { Module } from '@nestjs/common';
import { GeneralHelpService } from './help.service';
import { NestCordPaginationModule } from '@globalart/nestcord';
import { GeneralHelpInteractions } from './help.interactions';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  imports: [NestCordPaginationModule.forRoot(null), HelpersModule],
  providers: [GeneralHelpInteractions, GeneralHelpService],
})
export class GeneralHelpModule {}
