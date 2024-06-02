import { registerAs } from '@nestjs/config';
import { Colors } from 'discord.js';

export default registerAs(
  'discord',
  (): Record<string, unknown> => ({
    token: process.env.DISCORD_TOKEN,
    discordUserId: process.env.DISCORD_USER_ID,
    topGgToken: process.env.TOP_GG_TOKEN,
    sdcToken: process.env.SDC_TOKEN,
    boticordToken: process.env.BOTICORD_TOKEN,
    guildIdWithCommands: '711518189862780990',
    defaultEmbedColor: Colors.Blue,
    vipEmbedColor: Colors.Red,
  }),
);
