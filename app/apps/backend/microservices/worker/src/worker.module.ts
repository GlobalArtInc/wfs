import configs from '@app/shared/configs';
import { RedisCacheModule } from '@app/shared/modules/redis-microservice/redis-cache.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ClanModule } from './clan/clan.module';
import { PlayerModule } from './player/player.module';

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
    SharedModule,
    PlayerModule,
    ClanModule,
  ],
})
export class WorkerModule {}
