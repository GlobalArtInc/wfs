import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { PlayerController } from './controllers/player.controller';
import { PlayerService } from './player.service';

@Module({
  imports: [SharedModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
