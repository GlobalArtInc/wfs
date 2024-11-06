import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { HelpersModule } from '../../helpers/helpers.module';
import { TranslationModule as DiscordTranslationModule } from '../../translation/translation.module';
import { UtilityWeaponsInteractions } from './weapons.interactions';
import { UtilityWeaponsService } from './weapons.service';

@Module({
  imports: [SharedModule, HelpersModule, DiscordTranslationModule],
  providers: [UtilityWeaponsInteractions, UtilityWeaponsService],
})
export class UtilityWeaponsModule {}
