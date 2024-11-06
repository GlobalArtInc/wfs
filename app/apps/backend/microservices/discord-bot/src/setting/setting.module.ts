import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';

@Module({
  imports: [SharedModule],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
