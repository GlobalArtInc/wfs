import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { InternalBotApiService } from './internal-api.service';

@Module({
  imports: [HttpModule],
  providers: [InternalBotApiService],
  exports: [InternalBotApiService],
})
export class InternalBotApiModule {}
