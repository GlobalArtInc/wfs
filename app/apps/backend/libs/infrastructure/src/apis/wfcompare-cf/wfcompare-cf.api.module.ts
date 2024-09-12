import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WfCompareCfApiService } from './wfcompare-cf.api.service';

@Module({
  imports: [HttpModule],
  providers: [WfCompareCfApiService],
  exports: [WfCompareCfApiService],
})
export class WfCompareCfApiModule {}
