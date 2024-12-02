import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { TranslationModule as DiscordTranslationModule } from '../translation/translation.module';
import { UserModule } from '../user/user.module';
import { DiscordHelpersService } from './discord-helpers.service';
import { HelpersService } from './helpers.service';

const importS = [DiscordHelpersService, HelpersService];

@Module({
  imports: [SharedModule, UserModule, DiscordTranslationModule],
  providers: [...importS],
  exports: [...importS],
})
export class HelpersModule {}
