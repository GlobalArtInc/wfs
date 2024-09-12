import { HttpException } from '@nestjs/common';

export class DiscordErrorException extends HttpException {
  constructor(discordMessage: string) {
    super({ discordMessage }, 500);
  }
}
