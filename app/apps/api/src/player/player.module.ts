import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { PlayerController } from './controllers/player.controller';
import { PlayerService } from './player.service';
import { RedisMicroserviceModule } from '@app/shared/modules/redis-microservice/redis-microservice.module';
import { PlayerMessagingController } from './controllers/player.messaging-controller';

@Module({
  imports: [SharedModule, RedisMicroserviceModule],
  controllers: [PlayerController, PlayerMessagingController],
  providers: [PlayerService],
})
export class PlayerModule {}
