import { ServerRepository } from '@app/dal/repositories/server';
import { UserRepository } from '@app/dal/repositories/user';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { ClanInfo, PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { NestcordService } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { Colors } from 'discord.js';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class SetService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly serverRepository: ServerRepository,
    private readonly nestcordService: NestcordService,
    private translationService: TranslationService,
  ) {}

  async getUserSettingsAndGetEmbed(userId: string) {
    const user = await this.userRepository.getOneBy(
      { id: userId, client: 'discord' },
      { relations: ['usersClans', 'usersPlayers', 'defaultServer'] },
    );

    const clans = user.usersClans.map(
      (userClan) => `${this.nestcordService.getApplicationEmojiPlain('wfs_yes')} ${userClan.name}`,
    );
    const players = user.usersPlayers.map(
      (userPlayer) => `${this.nestcordService.getApplicationEmojiPlain('wfs_yes')} ${userPlayer.name}`,
    );

    const embed = await this.discordHelpersService.buildEmbed({ color: Colors.Blue });

    embed.setDescription(
      this.translationService.get('app.displayEmbeds.set.list.description', {
        defaultServer: this.translationService.get(`app.server.${user.defaultServer.id}`) || 'no',
        clans: clans.length ? clans.join('\r\n') : 'none',
        players: players.length ? players.join('\r\n') : 'none',
      }),
    );

    return embed;
  }

  async setServerAndGetEmbed(userId: string, server: string) {
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Green,
    });
    const user = await this.userRepository.getOneBy(
      { id: userId, client: 'discord' },
      { relations: ['defaultServer'] },
    );
    if (user.defaultServer.id === server) {
      throw new DiscordErrorException('app.errors.server_is_same');
    }
    embed.setTitle(this.translationService.get('app.labels.success')).setDescription(
      this.translationService.get('app.displayEmbeds.set.server.success', {
        defaultServer: server,
      }),
    );
    const defaultServer = await this.serverRepository.getOneBy({ id: server });
    await this.userRepository.updateOneById(userId as unknown as number, {
      defaultServer,
    });

    return embed;
  }

  async setPlayerAndGetEmbed(userId: string, playerName: string) {
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Green,
    });
    const user = await this.userRepository.getOne(userId, 'discord');
    const playerInfo = await this.internalBotApiService.send<PlayerInfo>('get', `player`, {
      name: playerName,
    });

    if (playerInfo.state.status === 'open') {
      user.usersPlayers = [
        {
          userId,
          name: playerInfo.player.nickname,
        },
      ];
      await this.userRepository.updateOneById(user.id as any, { usersPlayers: user.usersPlayers });

      return embed.setDescription(
        this.translationService.get('app.displayEmbeds.set.player.new_text', {
          server: playerInfo.server,
          nickname: playerInfo.player.nickname,
        }),
      );
    } else {
      throw new DiscordErrorException('app.errors.player_not_found');
    }
  }

  async setClanAndGetEmbed(userId: string, clanName: string) {
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Green,
    });
    const user = await this.userRepository.getOne(userId, 'discord');
    const clanInfos = await this.internalBotApiService.send<ClanInfo[]>('get', `clan`, {
      name: clanName,
    });
    if (clanInfos.length) {
      const clanInfo = clanInfos[0];
      user.usersClans = [
        {
          userId,
          name: clanInfo.data.name,
        },
      ];
      await this.userRepository.updateOneById(user.id as any, { usersClans: user.usersClans });
      embed.setDescription(
        this.translationService.get('app.displayEmbeds.set.clan.new_text', {
          server: clanInfo.server,
          name: clanInfo.data.name,
        }),
      );

      return embed;
    } else {
      throw new DiscordErrorException('app.errors.clan_not_found');
    }
  }
}
