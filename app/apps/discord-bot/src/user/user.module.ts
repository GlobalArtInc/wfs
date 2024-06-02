import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SharedModule } from '@app/shared/modules/shared.module';

@Module({
  imports: [SharedModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
