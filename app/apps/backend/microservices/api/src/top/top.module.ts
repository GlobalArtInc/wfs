import { Module } from '@nestjs/common';
import { TopService } from './top.service';
import { TopController } from './controllers/top.controller';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [SharedModule],
  providers: [TopService],
  controllers: [TopController],
})
export class TopModule {}
