import { Module } from '@nestjs/common';
import { UtilityWeaponsService } from './weapons.service';
import { UtilityWeaponsInteractions } from './weapons.interactions';
import { HelpersModule } from '../../helpers/helpers.module';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [SharedModule, HelpersModule],
  providers: [UtilityWeaponsInteractions, UtilityWeaponsService],
})
export class UtilityWeaponsModule {}
