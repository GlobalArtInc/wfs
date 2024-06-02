import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WfStatsCfApiService } from './wfstats-cf.api.service';

@Module({
  imports: [HttpModule],
  providers: [WfStatsCfApiService],
  exports: [WfStatsCfApiService],
})
export class WfStatsCfApiModule {}
