import { Module } from '@nestjs/common';
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
    ClanModule,
    OnlineModule,
    PlayerModule,
    TopModule,
    WeaponsModule,
    SharedModule,
  ],
})
export class ApiModule {}
