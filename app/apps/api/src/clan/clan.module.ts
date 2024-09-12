import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClanController } from './controllers/clan.controller';
import { ClanService } from './clan.service';
import { SharedModule } from '@app/shared/modules/shared.module';
import { RedisMicroserviceModule } from '@app/shared/modules/redis-microservice/redis-microservice.module';

@Module({
  imports: [SharedModule, RedisMicroserviceModule],
  controllers: [ClanController],
  providers: [ClanService],
})
export class ClanModule {}
