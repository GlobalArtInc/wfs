import { Module } from '@nestjs/common';
import { GeneralHelpModule } from './help/help.module';
import { GeneralOnlineModule } from './online/online.module';
import { GeneralUrlModule } from './url/url.module';
import { SetModule } from './set/set.module';

@Module({
  imports: [GeneralHelpModule, GeneralOnlineModule, GeneralUrlModule, SetModule],
})
export class GeneralModule {}
