import { Module } from '@nestjs/common';
import { TopService } from './top.service';
import { TopInteractions } from './top.interactions';
import { HelpersModule } from '../../helpers/helpers.module';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [SharedModule, HelpersModule],
  providers: [TopInteractions, TopService],
})
export class TopModule {}
