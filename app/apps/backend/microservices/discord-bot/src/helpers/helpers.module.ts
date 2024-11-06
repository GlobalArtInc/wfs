import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { TranslationModule as DiscordTranslationModule } from '../translation/translation.module';
import { UserModule } from '../user/user.module';
import { DiscordHelpersService } from './discord-helpers.service';
import { HelpersService } from './helpers.service';

const IMPORTS = [DiscordHelpersService, HelpersService];

@Module({
  imports: [SharedModule, UserModule, DiscordTranslationModule],
  providers: [...IMPORTS],
  exports: [...IMPORTS],
})
export class HelpersModule {}
