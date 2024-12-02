import { InternalBotApiModule } from '@app/infrastructure/apis/internal-api';
import { WarfaceApiModule } from '@app/infrastructure/apis/warface/warface.api.module';
import { WfOnlineApiModule } from '@app/infrastructure/apis/wf-online/wf-online.api.module';
import { WfCompareCfApiModule } from '@app/infrastructure/apis/wfcompare-cf/wfcompare-cf.api.module';
import { WfStatsCfApiModule } from '@app/infrastructure/apis/wfstats-cf/wfstats-cf.api.module';
import { Module } from '@nestjs/common';
import { HelpersModule } from './helpers/helpers.module';

const importS = [WarfaceApiModule, WfOnlineApiModule, WfCompareCfApiModule, InternalBotApiModule, WfStatsCfApiModule];

@Module({
  imports: [...importS, HelpersModule],
  exports: [...importS],
})
export class InterApiModule {}
