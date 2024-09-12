import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [SharedModule],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
