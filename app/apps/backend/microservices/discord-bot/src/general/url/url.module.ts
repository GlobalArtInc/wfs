import { Module } from '@nestjs/common';
import { GeneralUrlService } from './url.service';
import { GeneralUrlInteractions } from './url.interactions';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  imports: [HelpersModule],
  providers: [GeneralUrlInteractions, GeneralUrlService],
})
export class GeneralUrlModule {}
