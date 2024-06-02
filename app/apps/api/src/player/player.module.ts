import { SharedModule } from '@app/shared/modules/shared.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './controllers/player.controller';
import { PlayerService } from './player.service';

@Module({
  imports: [SharedModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
