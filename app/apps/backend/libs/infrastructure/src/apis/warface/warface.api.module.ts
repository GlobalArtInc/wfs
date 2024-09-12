import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WarfaceApiService } from './warface.api.service';

@Module({
  imports: [HttpModule],
  providers: [WarfaceApiService],
  exports: [WarfaceApiService],
})
export class WarfaceApiModule {}
