import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { CreateUserInvitationsDto } from './dto/create-user-invitations.dto';
import { UserInvitationService } from './user-invitation.service';

@Controller('api/user-invitations')
@UseGuards(AuthenticatedGuard, AdminGuard)
export class UserInvitationController {
  constructor(private readonly userInvitationService: UserInvitationService) {}

  @Post()
  createMany(@Body() dto: CreateUserInvitationsDto, @CurrentUser() user: User) {
    return this.userInvitationService.inviteMany(dto.emails, user.id);
  }
}
