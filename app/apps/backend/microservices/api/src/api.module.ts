import configs from '@app/shared/configs';
import { RedisCacheModule } from '@app/shared/modules/redis-microservice/redis-cache.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AchievementModule } from './achievement/achievement.module';
import { ClanModule } from './clan/clan.module';
import { OnlineModule } from './online/online.module';
import { PlayerModule } from './player/player.module';
import { TopModule } from './top/top.module';
import { WeaponsModule } from './weapons/weapons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configs],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
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
