import { RequestClsService } from '@app/shared/modules/request-cls/request-cls.service';
import { NestcordService } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';
import { SettingService } from '../../setting/setting.service';
import { TranslationService } from '../../translation/translation.service';

@Injectable()
export class GeneralScoreService {
  constructor(
    private readonly requestClsService: RequestClsService,
    private readonly settingService: SettingService,
    private readonly discordHelpersService: DiscordHelpersService,
    private readonly nestcordService: NestcordService,
    private translationService: TranslationService,
  ) {}

  private readonly settingKey = 'score';

  async createEmbed(missionName: string) {
    const scoreSettings = await this.settingService.getValueByKey(this.settingKey);
    const scoreStat = scoreSettings[missionName];
    const embed = await this.discordHelpersService.buildEmbed({});

    const description = Object.values(scoreStat.mode)
      .map((mode: any) => {
        return this.translationService.get('app.displayEmbeds.score.descriptionItem', {
          modeName: this.translationService.get(`app.mode.${mode.name}`),
          emoji: {
            mode: this.nestcordService.getApplicationEmojiPlain(`wfs_${mode.name}`),
            score: this.nestcordService.getApplicationEmojiPlain(`wfs_kills_wf`),
            time: this.nestcordService.getApplicationEmojiPlain(`wfs_time_wf`),
            crown: this.nestcordService.getApplicationEmojiPlain(`wfs_crown_wf`),
          },
          stats: {
            time: mode.time,
            score: mode.score,
            crown: mode.crown,
          }
        });
      })
      .join('\n\n');

    embed.setTitle(
      this.translationService.get('app.displayEmbeds.score.title', {
        missionName: this.translationService.get(`app.missions.${missionName}`),
      }),
    );
    embed.setDescription(description);

    return embed;
  }
}
