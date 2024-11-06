import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { SettingModule } from '../../setting/setting.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';
import { UserModule } from '../../user/user.module';
import { ClanService } from './clan.service';

@Module({
  imports: [UserModule, SharedModule, DiscordTranslationModule, SettingModule, HelpersModule],
  providers: [ClanService],
})
export class ClanModule {}
