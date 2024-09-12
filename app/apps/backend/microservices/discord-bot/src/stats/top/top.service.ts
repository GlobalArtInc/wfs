import { Injectable } from '@nestjs/common';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { Colors } from 'discord.js';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { TopInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';

@Injectable()
export class TopService {
  constructor(
    private readonly internalBotApiService: InternalBotApiService,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  async embed(mission: string) {
    const missions = await this.internalBotApiService.send<TopInfo>('get', `top/mission`, {
      name: mission,
    });
    let i = 0;

    const players = missions.items.map((item) => {
      i++;
      return `\`[${i}] ${item.nickname} ${item.won} / ${item.lost}\``;
    });

    if (!players.length) {
      throw new DiscordErrorException('app.errors.players_not_found');
    }

    const embed = await this.discordHelpersService.buildEmbed({ color: Colors.Green });
    embed
      .setThumbnail('https://wf.cdn.gmru.net/wiki/images/4/4f/Homepage7.jpg')
      .setTitle(`top - ${mission}`)
      .setDescription(players.join('\r\n'));

    return embed;
  }
}
