import { Module } from '@nestjs/common';
import { NestCordPaginationModule } from '@globalart/nestcord';
import { GeneralOnlineService } from './online.service';
import { SharedModule } from '@app/shared/modules/shared.module';
import { GeneralOnlineInteractions } from './online.interactions';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  imports: [NestCordPaginationModule.forRoot(null), SharedModule, HelpersModule],
  providers: [GeneralOnlineInteractions, GeneralOnlineService],
})
export class GeneralOnlineModule {}
