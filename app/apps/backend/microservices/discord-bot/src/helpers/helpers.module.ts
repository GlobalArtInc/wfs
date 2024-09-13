import { Module } from '@nestjs/common';
import { DiscordHelpersService } from './discord-helpers.service';
import { HelpersService } from './helpers.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { TranslationModule as DiscordTranslationModule } from '../translation/translation.module';

const IMPORTS = [DiscordHelpersService, HelpersService];

@Module({
  imports: [SharedModule, UserModule, DiscordTranslationModule],
  providers: [...IMPORTS],
  exports: [...IMPORTS],
})
export class HelpersModule {}
