import { RedisMicroserviceModule } from '@app/shared/modules/redis-microservice/redis-microservice.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { ClanService } from './clan.service';
import { ClanController } from './controllers/clan.controller';

@Module({
  imports: [SharedModule, RedisMicroserviceModule],
  controllers: [ClanController],
  providers: [ClanService],
})
export class ClanModule {}
