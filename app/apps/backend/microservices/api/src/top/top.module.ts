import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { TopController } from './controllers/top.controller';
import { TopService } from './top.service';

@Module({
  imports: [SharedModule],
  providers: [TopService],
  controllers: [TopController],
})
export class TopModule {}
