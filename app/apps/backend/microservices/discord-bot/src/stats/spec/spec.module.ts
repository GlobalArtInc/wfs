import { Module } from '@nestjs/common';
import { SpecService } from './spec.service';
import { UserModule } from '../../user/user.module';
import { SettingModule } from '../../setting/setting.module';
import { SpecInteractions } from './spec.interactions';
import { HelpersModule } from '../../helpers/helpers.module';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [UserModule, SharedModule, SettingModule, HelpersModule],
  providers: [SpecInteractions, SpecService],
})
export class SpecModule {}
