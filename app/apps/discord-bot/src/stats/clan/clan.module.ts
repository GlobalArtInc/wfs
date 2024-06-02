import { Module } from '@nestjs/common';
import { ClanService } from './clan.service';
import { SharedModule } from '@app/shared/modules/shared.module';
import { UserModule } from '../../user/user.module';
import { SettingModule } from '../../setting/setting.module';
import { HelpersModule } from '../../helpers/helpers.module';

@Module({
  imports: [UserModule, SharedModule, SettingModule, HelpersModule],
  providers: [ClanService],
})
export class ClanModule {}
