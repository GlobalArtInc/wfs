import { Module } from '@nestjs/common';
import { UtilityWeaponsService } from './weapons.service';
import { SharedModule } from '@app/shared/modules/shared.module';
import { UtilityWeaponsInteractions } from './weapons.interactions';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  imports: [SharedModule, HelpersModule],
  providers: [UtilityWeaponsInteractions, UtilityWeaponsService],
})
export class UtilityWeaponsModule {}
