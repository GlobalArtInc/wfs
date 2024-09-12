import { Injectable } from '@nestjs/common';
import { CacheType, ChatInputCommandInteraction, Locale, User } from 'discord.js';

import { ClsService } from 'nestjs-cls';

@Injectable()
export class RequestClsService {
  constructor(private readonly clsService: ClsService) {}

  getInteraction(): ChatInputCommandInteraction<CacheType> {
    return this.clsService.get('interaction');
  }

  getUser(): User {
    return this.clsService.get('discordUser');
  }

  getUserLang(): Locale {
    return this.clsService.get('userLocale');
  }

  getGuildLang(): Locale {
    return this.clsService.get('guildLocale');
  }
}
