import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { UserInvitationModule } from 'src/user-invitation/user-invitation.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule, MailModule, UserInvitationModule],
  exports: [AuthService],
})
export class AuthModule {}
