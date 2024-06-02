import { Module } from '@nestjs/common';
import { OnlineService } from './online.service';
import { OnlineController } from './controllers/online.controller';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [SharedModule],
  providers: [OnlineService],
  controllers: [OnlineController],
})
export class OnlineModule {}
