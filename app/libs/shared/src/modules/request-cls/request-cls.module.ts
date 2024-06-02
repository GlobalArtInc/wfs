import { Global, Module, Provider } from '@nestjs/common';

import { ClsModule as NestClsModule } from 'nestjs-cls';
import { RequestClsService } from './request-cls.service';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';

const IMPORTS = [
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
  imports: [...IMPORTS],
  providers: [...PROVIDERS],
  exports: [...IMPORTS, ...PROVIDERS],
})
export class RequestClsModule {}
