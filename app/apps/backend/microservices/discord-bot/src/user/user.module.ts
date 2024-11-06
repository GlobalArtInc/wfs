import { SharedModule } from '@app/shared/modules/shared.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [SharedModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
