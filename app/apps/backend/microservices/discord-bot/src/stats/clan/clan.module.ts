import { Module } from '@nestjs/common';
import { ClanService } from './clan.service';
import { UserModule } from '../../user/user.module';
import { SettingModule } from '../../setting/setting.module';
import { HelpersModule } from '../../helpers/helpers.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';

@Module({
  imports: [UserModule, SharedModule, DiscordTranslationModule, SettingModule, HelpersModule],
  providers: [ClanService],
})
export class ClanModule {}
