import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { PlayerMessagingController } from './controllers/player.messaging-controller';
import { PlayerService } from './player.service';

@Module({
  imports: [SharedModule],
  controllers: [PlayerMessagingController],
  providers: [PlayerService],
})
export class PlayerModule {}
