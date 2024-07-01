import { Injectable, Logger } from '@nestjs/common';
import { ActivityType, Client, Interaction } from 'discord.js';
import { Context, ContextOf, On, Once, SlashCommandContext } from '@globalart/nestcord';
import { UserRepository } from '@app/dal/repositories/user';
import { ServerEntity, ServerRepository } from '@app/dal/repositories/server';

@Injectable()
export class DiscordBotGateway {
  private readonly logger = new Logger(DiscordBotGateway.name);

  public constructor(
    private readonly client: Client,
    private readonly userRepository: UserRepository,
    private readonly serverRepository: ServerRepository,
  ) {}

  @Once('ready')
  async onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);
    await this.setPresence();
    setInterval(() => this.setPresence(), 60000);
  }

  @On('warn')
  public onWarn(@Context() [info]: ContextOf<'warn'>) {
    this.logger.warn(info);
  }

  @On('error')
  public onError(@Context() [error]: ContextOf<'error'>) {
    this.logger.error(error);
  }

  @On('debug')
  public onDebug(@Context() [info]: ContextOf<'debug'>) {
    this.logger.debug(info);
  }

  @On('interactionCreate')
  public async onInteraction(@Context() [interaction]: SlashCommandContext) {
    const user = await this.userRepository.getOneBy(
      { id: interaction.user.id, client: 'discord' },
      { relations: ['defaultServer'] },
    );

    await this.userRepository.upsert({
      client: 'discord',
      id: interaction.user.id,
      defaultServer: user?.defaultServer || (await this.serverRepository.getOneBy({ id: 'ru' })),
      language: interaction.locale,
      username: interaction.user.tag,
    });
  }

  private async setPresence() {
    return this.client.user.setPresence({
      activities: [
        {
          type: ActivityType.Watching,
          state: 'online',
          name: '/help',
        },
      ],
      status: 'online',
    });
  }
}
