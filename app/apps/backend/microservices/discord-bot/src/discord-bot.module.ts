import { Module } from '@nestjs/common';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DefaultLocalizationAdapter,
  NestCordLocalizationModule,
  NestCordModule,
  NestCordStatReporterModule,
  StatCronExpression,
  UserResolver,
} from '@globalart/nestcord';
import { GatewayIntentBits, Partials } from 'discord.js';
import configs from './configs';
import { DiscordBotGateway } from './discord-bot.gateway';
import { GeneralModule } from './general/general.module';
import { UtilityModule } from './utility/utility.module';
import { StatsModule } from './stats/stats.module';
import { UserModule } from './user/user.module';
import { TranslatorService } from '@app/shared/modules/class-translator/translation.service';
import { RequestClsModule } from '@app/shared/modules/request-cls';
import { SharedModule } from '@app/shared/modules/shared.module';
import { TranslationModule } from '@app/shared/translation/translation.module';
import { TranslationModule as DiscordTranslationModule } from './translation/translation.module';

const INTERACTION_MODULES = [GeneralModule, UtilityModule, StatsModule];

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
    ...INTERACTION_MODULES,
    NestCordModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow('discord.token'),
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.DirectMessageReactions,
        ],
        partials: [Partials.Message, Partials.Channel, Partials.Reaction],
      }),
      inject: [ConfigService],
    }),
    NestCordLocalizationModule.forRootAsync({
      useFactory: async (translatorService: TranslatorService) => {
        await translatorService.upsertFromRemote();
        const locales = translatorService.transformDictsToDsLocales();

        return {
          resolvers: [UserResolver],
          adapter: new DefaultLocalizationAdapter({
            fallbackLocale: 'en-US',
            locales,
          }),
        };
      },
      inject: [TranslatorService],
    }),
    NestCordStatReporterModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const botId = configService.getOrThrow('discord.discordUserId');
        const topGgToken = configService.get('discord.topGgToken');
        const discordBotListComToken = configService.get('discord.discordBotListComToken');
        const sdcToken = configService.get('discord.sdcToken');
        const boticordToken = configService.get('discord.boticordToken');

        return {
          development: !configService.getOrThrow('common.isProductionableEnv'),
          services: [
            {
              name: 'top.gg',
              url: `https://top.gg/api/bots/${botId}/stats`,
              bodyData: { server_count: '{{serverCount}}', shard_count: '{{shardCount}}' },
              headerData: {
                Authorization: topGgToken,
              },
              schedule: StatCronExpression.EVERY_MINUTE,
            },
            {
              name: 'DiscordBotList.Com',
              url: `https://discordbotlist.com/api/v1/bots/${botId}/stats`,
              bodyData: { guilds: '{{serverCount}}' },
              headerData: {
                Authorization: discordBotListComToken,
              },
              schedule: StatCronExpression.EVERY_MINUTE,
            },
            {
              name: 'SDC Bots',
              url: `https://api.server-discord.com/v2/bots/${botId}/stats`,
              bodyData: { servers: '{{serverCount}}', shards: '{{shardCount}}' },
              headerData: {
                Authorization: `SDC ${sdcToken}`,
              },
              schedule: StatCronExpression.EVERY_2_MINUTES,
            },
            {
              name: 'Boticord.top',
              url: `https://api.boticord.top/v3/bots/${botId}/stats`,
              bodyData: { servers: '{{serverCount}}', shards: '{{shardCount}}' },
              headerData: {
                Authorization: boticordToken,
              },
              schedule: StatCronExpression.EVERY_MINUTE,
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
    TranslationModule,
    DiscordTranslationModule,
    SharedModule,
    UserModule,
    RequestClsModule,
  ],
  providers: [DiscordBotGateway],
})
export class DiscordBotModule {}
