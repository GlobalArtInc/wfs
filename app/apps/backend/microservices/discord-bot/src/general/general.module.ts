import { Module } from '@nestjs/common';
import { GeneralHelpModule } from './help/help.module';
import { GeneralOnlineModule } from './online/online.module';
import { GeneralScoreModule } from './score/score.module';
import { SetModule } from './set/set.module';
import { GeneralUrlModule } from './url/url.module';

@Module({
  imports: [GeneralHelpModule, GeneralOnlineModule, GeneralUrlModule, SetModule, GeneralScoreModule],
})
export class GeneralModule {}
