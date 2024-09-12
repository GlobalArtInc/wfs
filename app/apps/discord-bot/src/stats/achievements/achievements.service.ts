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
import { AchievementData, MissionAchievement, PlayerAchievement } from './achievements.interfaces';

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
  private readonly achievementsKey = 'achievements';

  async createEmbed(name: string, mission: string, trans: TranslationFn) {
    const embed = await this.discordHelpersService.buildEmbed();
    const discordUserId = this.requestClsService.getUser().id;
    const playerName = name || (await this.userService.getLinkedPlayer(discordUserId));

    if (!playerName) {
      throw new DiscordErrorException('app.errors.player_name_not_specified');
    }

    const achievementsStat = await this.settingService.getValueByKey(this.achievementsKey);
    const missionData: AchievementData = achievementsStat[mission];
    const playerInfo = await this.fetchPlayerInfo(playerName);
    const buildedAchievements = this.mapAchievements(missionData.achievements, playerInfo.achievements);

    embed
      .setAuthor(this.createAuthorObject(playerInfo))
      .setTitle(this.createTitle(trans, missionData.id))
      .setThumbnail(missionData.img)
      .setFields(this.createFields(trans, missionData, buildedAchievements));

    return embed;
  }

  private mapAchievements(missionAchievements: MissionAchievement[], playerAchievements?: PlayerAchievement[]) {
    const playerAchievementMap = new Map(
      playerAchievements.map((playerAchievement) => [playerAchievement.achievement_id, playerAchievement]),
    );
    const concreteAchievementMap = new Map();
    missionAchievements.forEach((missionAchievement) => {
      if (playerAchievementMap.has(missionAchievement.id)) {
        const playerAchievement = playerAchievementMap.get(missionAchievement.id);
        concreteAchievementMap.set(missionAchievement.id, { playerAchievement, missionAchievement });
      }
    });

    return concreteAchievementMap;
  }

  private async fetchPlayerInfo(playerName: string): Promise<PlayerInfo> {
    return this.internalBotApiService.send<PlayerInfo>('get', 'player', { name: playerName });
  }

  private createAuthorObject(playerInfo: PlayerInfo): { name: string; url: string; iconURL: string } {
    return {
      name: `[${playerInfo.server.toUpperCase()}] ${playerInfo.player.nickname} (${playerInfo.player.rank_id})`,
      url: `https://wfts.su/profile/${playerInfo.player.nickname}`,
      iconURL: this.nestcordService.getApplicationEmoji(`wfs_rank_${playerInfo.player.rank_id}`)?.imageURL() || '',
    };
  }

  private createTitle(trans: TranslationFn, missionId: string): string {
    return trans('app.displayEmbeds.achievements.title', { mission: trans(`app.missions.${missionId}`) });
  }

  private createFields(
    trans: TranslationFn,
    missionData: AchievementData,
    achievementsMap: Map<string, { missionAchievement: MissionAchievement; playerAchievement: PlayerAchievement }>,
  ): APIEmbedField[] {
    return Array.from(achievementsMap.values()).map(({ missionAchievement, playerAchievement }) => {
      const achievementName = trans(`achievement.${missionData.id}.${missionAchievement.id}`);
      const isCompleted = !!playerAchievement.completion_time;
      const emoji = this.nestcordService.getApplicationEmojiPlain(isCompleted ? 'wfs_yes' : 'wfs_no');
      const value = isCompleted
        ? `${emoji} ${playerAchievement.completion_time}`
        : `${emoji} ${playerAchievement.progress} / ${missionAchievement.goal}`;

      return {
        name: achievementName,
        value,
        inline: true,
      };
    });
  }
}
