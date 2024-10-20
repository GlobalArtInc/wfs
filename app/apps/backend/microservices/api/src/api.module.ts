import { Module } from '@nestjs/common';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClanModule } from './clan/clan.module';
import { OnlineModule } from './online/online.module';
import { PlayerModule } from './player/player.module';
import { TopModule } from './top/top.module';
import { WeaponsModule } from './weapons/weapons.module';
import { RedisCacheModule } from '@app/shared/modules/redis-microservice/redis-cache.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { AchievementModule } from './achievement/achievement.module';
import configs from '@app/shared/configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configs],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('db'),
      }),
      dataSourceFactory: async (options) => addTransactionalDataSource(new DataSource(options)),
    }),
    RedisCacheModule,
    ClanModule,
    OnlineModule,
    PlayerModule,
    TopModule,
    WeaponsModule,
    SharedModule,
    AchievementModule,
  ],
})
export class ApiModule {}
