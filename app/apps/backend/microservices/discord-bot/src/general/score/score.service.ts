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
    const discordUserId = this.requestClsService.getUser().id;
    const scoreSettings = await this.settingService.getValueByKey(this.settingKey);
    const scoreStat = scoreSettings[missionName];
    const embed = await this.discordHelpersService.buildEmbed({});
  
    const description = Object.values(scoreStat.mode)
      .map((mode: any) => {
        return this.translationService.get('app.displayEmbeds.score.descriptionItem', { emoji: this.nestcordService.getApplicationEmoji(`wfs_${mode.name}`), mode });
      })
      .join('\n\n');
  
    embed.setTitle(this.translationService.get('app.displayEmbeds.score.title', {
      missionName,
    }));
    embed.setDescription(description);
    
    return embed;
  }
  
}
