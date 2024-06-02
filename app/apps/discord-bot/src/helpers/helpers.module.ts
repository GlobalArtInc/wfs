import { Module } from '@nestjs/common';
import { DiscordHelpersService } from './discord-helpers.service';
import { HelpersService } from './helpers.service';
import { SharedModule } from '@app/shared/modules/shared.module';
import { UserModule } from '../user/user.module';

const IMPORTS = [DiscordHelpersService, HelpersService];

@Module({
  imports: [SharedModule, UserModule],
  providers: [...IMPORTS],
  exports: [...IMPORTS],
})
export class HelpersModule {}
