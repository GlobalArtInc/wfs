import { NestcordService } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { UserService } from '../../user/user.service';
import { SettingService } from '../../setting/setting.service';
import { APIEmbedField } from 'discord.js';
import { DiscordErrorException } from '../../exceptions/discord-error.exception';
import { AchievementData, MissionAchievement, PlayerAchievement } from './achievements.interfaces';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { PlayerInfo } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly settingService: SettingService,
    private readonly requestClsService: RequestClsService,
    private readonly internalBotApiService: InternalBotApiService,
    private readonly userService: UserService,
    private readonly nestcordService: NestcordService,
    private translationService: TranslationService,
  ) {}
  private readonly achievementsKey = 'achievements';

  async createEmbed(name: string, mission: string) {
    const embed = await this.discordHelpersService.buildEmbed();
    const discordUserId = this.requestClsService.getUser().id;
    const playerName = name || (await this.userService.getLinkedPlayer(discordUserId));

    if (!playerName) {
      throw new DiscordErrorException('app.errors.player_name_not_specified');
    }

    const achievementsStat = await this.settingService.getValueByKey(this.achievementsKey);
    const missionData: AchievementData = achievementsStat[mission];
    const playerInfo = await this.fetchPlayerInfo(playerName);

    if (!missionData) {
      throw new DiscordErrorException('app.errors.mission_not_found');
    }
    const buildedAchievements = this.mapAchievements(missionData.achievements, playerInfo.achievements);

    embed
      .setAuthor(this.createAuthorObject(playerInfo))
      .setTitle(this.createTitle(missionData.id))
      .setFields(this.createFields(missionData, buildedAchievements));
    if (this.nestcordService.getApplicationAsset(missionData.id)) {
      embed.setThumbnail(this.nestcordService.getApplicationAsset(missionData.id).url);
    }

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
      } else {
        concreteAchievementMap.set(missionAchievement.id, {
          playerAchievement: { progress: 0, completion_time: null },
          missionAchievement,
        });
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

  private createTitle(missionId: string): string {
    return this.translationService.get('app.displayEmbeds.achievements.title', {
      mission: this.translationService.get(`app.missions.${missionId}`),
    });
  }

  private createFields(
    missionData: AchievementData,
    achievementsMap: Map<string, { missionAchievement: MissionAchievement; playerAchievement: PlayerAchievement }>,
  ): APIEmbedField[] {
    const fields = Array.from(achievementsMap.values()).map(({ missionAchievement, playerAchievement }) => {
      const achievementName = this.translationService.get(`achievement.${missionData.id}.${missionAchievement.id}`);
      const isCompleted = !!playerAchievement.completion_time;
      const emoji = this.nestcordService.getApplicationEmojiPlain(isCompleted ? 'wfs_yes_round' : 'wfs_no_round');
      const value = isCompleted
        ? `${emoji} ${playerAchievement.completion_time}`
        : `${emoji} ${playerAchievement.progress} / ${missionAchievement.goal}`;

      return {
        name: achievementName,
        value,
        inline: true,
      };
    });

    if (fields.length % 2 === 0) {
      fields.push({ name: '\u200b', value: '\u200b', inline: true });
    }

    return fields;
  }
}
