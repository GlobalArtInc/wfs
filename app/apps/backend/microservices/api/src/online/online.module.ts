import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { OnlineController } from './controllers/online.controller';
import { OnlineService } from './online.service';

@Module({
  imports: [SharedModule],
  providers: [OnlineService],
  controllers: [OnlineController],
})
export class OnlineModule {}
