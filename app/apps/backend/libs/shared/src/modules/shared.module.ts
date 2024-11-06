import { DAL_ENTITIES, DAL_REPOSITORIES } from '@app/dal/repositories';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { HelpersModule } from './helpers/helpers.module';
import { InterApiModule } from './inter-api.module';

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
