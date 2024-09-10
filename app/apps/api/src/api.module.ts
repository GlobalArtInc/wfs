import { Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@app/shared/modules/shared.module';
import { ClanModule } from './clan/clan.module';
import configs from '@app/shared/configs';
import { OnlineModule } from './online/online.module';
import { PlayerModule } from './player/player.module';
import { TopModule } from './top/top.module';
import { WeaponsModule } from './weapons/weapons.module';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheModule } from '@app/shared/modules/redis-microservice/redis-cache.module';

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
  ],
})
export class ApiModule {}
