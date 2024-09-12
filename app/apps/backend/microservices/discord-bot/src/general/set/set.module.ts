import { Module } from '@nestjs/common';
import { SetService } from './set.service';
import { SetInteractions } from './set.interactions';
import { HelpersModule } from '../../helpers/helpers.module';
import { SettingModule } from '../../setting/setting.module';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [SharedModule, HelpersModule, SettingModule],
  providers: [SetInteractions, SetService],
})
export class SetModule {}
