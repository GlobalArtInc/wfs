import { Global, Module, Provider } from '@nestjs/common';

import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { ClsModule as NestClsModule } from 'nestjs-cls';
import { RequestClsService } from './request-cls.service';

const importS = [
  NestClsModule.forRoot({
    interceptor: {
      mount: true,
      setup: (cls, context: ExecutionContextHost) => {
        const data = context.switchToRpc().getData();
        const interaction = data[0] as ChatInputCommandInteraction<CacheType>;
        if (interaction) {
          cls.set('interaction', interaction);
          cls.set('discordUser', interaction.user);
          cls.set('userLocale', interaction.locale);
          cls.set('guildLocale', interaction.guildLocale);
        }
      },
    },
  }),
];

const PROVIDERS: Provider[] = [
  {
    provide: RequestClsService,
    useClass: RequestClsService,
  },
];

@Global()
@Module({
  imports: [...importS],
  providers: [...PROVIDERS],
  exports: [...importS, ...PROVIDERS],
})
export class RequestClsModule {}
