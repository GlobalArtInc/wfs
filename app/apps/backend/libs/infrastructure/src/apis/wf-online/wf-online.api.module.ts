import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WfOnlineApiService } from './wf-online.api.service';

@Module({
  imports: [HttpModule],
  providers: [WfOnlineApiService],
  exports: [WfOnlineApiService],
})
export class WfOnlineApiModule {}
