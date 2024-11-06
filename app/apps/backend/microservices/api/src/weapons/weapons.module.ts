import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { WeaponsController } from './weapons.controller';
import { WeaponsService } from './weapons.service';

@Module({
  imports: [SharedModule],
  providers: [WeaponsService],
  controllers: [WeaponsController],
})
export class WeaponsModule {}
