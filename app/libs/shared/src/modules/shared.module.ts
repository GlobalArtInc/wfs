import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DAL_ENTITIES, DAL_REPOSITORIES } from '@app/dal/repositories';
import { HealthModule } from './health/health.module';
import { InterApiModule } from './inter-api.module';
import { HelpersModule } from './helpers/helpers.module';
import { SettingModule } from '../../../../apps/discord-bot/src/setting/setting.module';

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
