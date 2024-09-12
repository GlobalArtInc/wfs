import { Module } from '@nestjs/common';
import { ClanService } from './clan.service';
import { UserModule } from '../../user/user.module';
import { SettingModule } from '../../setting/setting.module';
import { HelpersModule } from '../../helpers/helpers.module';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [UserModule, SharedModule, SettingModule, HelpersModule],
  providers: [ClanService],
})
export class ClanModule {}
