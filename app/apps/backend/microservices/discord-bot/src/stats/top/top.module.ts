import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { TopInteractions } from './top.interactions';
import { TopService } from './top.service';

@Module({
  imports: [SharedModule, HelpersModule],
  providers: [TopInteractions, TopService],
})
export class TopModule {}
