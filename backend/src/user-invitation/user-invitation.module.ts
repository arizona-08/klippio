import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { UserInvitationController } from './user-invitation.controller';
import { UserInvitationService } from './user-invitation.service';

@Module({
  imports: [MailModule],
  controllers: [UserInvitationController],
  providers: [UserInvitationService],
  exports: [UserInvitationService],
})
export class UserInvitationModule {}
