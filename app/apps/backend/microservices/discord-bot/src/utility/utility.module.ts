import { Module } from '@nestjs/common';
import { UtilityWeaponsModule } from './weapons/weapons.module';

@Module({
  imports: [
    // UtilityWeaponsModule
  ],
})
export class UtilityModule {}
