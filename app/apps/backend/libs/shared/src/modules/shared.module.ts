import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { InterApiModule } from './inter-api.module';
import { HelpersModule } from './helpers/helpers.module';
import { DAL_ENTITIES, DAL_REPOSITORIES } from '@app/dal/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([...DAL_ENTITIES]), InterApiModule, HelpersModule, HealthModule],
  providers: [...DAL_REPOSITORIES, ConfigService],
  exports: [
    TypeOrmModule.forFeature([...DAL_ENTITIES]),
    ...DAL_REPOSITORIES,
    InterApiModule,
    HelpersModule,
    ConfigService,
  ],
})
export class SharedModule {}
