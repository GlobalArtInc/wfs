import { NestcordService, TranslationFn } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { UserService } from '../../user/user.service';
import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';
import { SettingService } from '../../setting/setting.service';
import { APIEmbedField } from 'discord.js';
import { PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly settingService: SettingService,
    private readonly requestClsService: RequestClsService,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly userService: UserService,
    private readonly nestcordService: NestcordService,
  ) {}

  async embed(name: string, mission: string, trans: TranslationFn) {
    const embed = await this.discordHelpersService.buildEmbed();
    const discordUserId = this.requestClsService.getUser().id;
    const playerName = name || (await this.userService.getLinkedPlayer(discordUserId));
    if (!playerName) {
      throw new DiscordErrorException('app.errors.player_name_not_specified');
    }

    const achievementsStat = await this.settingService.getValueByKey('achievements');

    const playerInfo = await this.internalBotApiService.send<PlayerInfo>('get', `player/${playerName}`);
    const missionData = achievementsStat[mission] as {
      id: string;
      img: string;
      achievements: { id: string; progress: number; completion_time: string }[];
    };
    const achievements = new Map();

    missionData.achievements.forEach((achievementData) => {
      const achievement = {
        item: { achievement_id: achievementData.id, progress: 0, completion_time: '' },
        data: achievementData,
      };
      achievements.set(achievementData.id, achievement);
    });

    playerInfo.achievements?.forEach((item) => {
      const achievement = achievements.get(item.achievement_id);
      if (achievement) {
        achievement.item.progress = item.progress;
        achievement.item.completion_time = item.completion_time;
      }
    });

    embed
      .setAuthor({
        name: this.getPlayerAuthor(playerInfo.player.nickname, playerInfo.player.rank_id, playerInfo.server),
        url: `https://wfts.su/profile/${playerInfo.player.nickname}`,
        iconURL: `https://s3.globalart.dev/api/s3/wfs/ranks/Rank${playerInfo.player.rank_id}.png`,
      })
      .setTitle(trans('app.displayEmbeds.achievements.title', { mission: trans(`app.missions.${missionData.id}`) }))
      .setThumbnail(missionData.img);

    const fields: APIEmbedField[] = [];
    achievements.forEach(({ item, data }) => {
      const value = item.completion_time
        ? `${this.nestcordService.getEmojiPlain('wfs_yes')} ${item.completion_time}`
        : `${this.nestcordService.getEmojiPlain('wfs_no')} ${item.progress} / ${data.goal}`;
      fields.push({ name: trans(`achievement.${mission}.${data.id}`), value, inline: true });
    });
    embed.setFields(fields);

    return embed;
  }

  private getPlayerAuthor(name: string, rankId: number, server: string) {
    return `[${server.toUpperCase()}] ${name} (${rankId})`;
  }
}
