import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { StatsService } from './stats.service';
import type { User } from 'src/user/interfaces/user.interface';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(AuthenticatedGuard)
@Controller('api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('my-stats')
  async getMyStats(@CurrentUser() user: User) {
    return this.statsService.getUserStats(user.id);
  }

  @Get('three-last-opened-plans')
  async getThreeLastOpenedPlans(@CurrentUser() user: User) {
    return this.statsService.getThreeLastOpenedPlans(user.id);
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  async getAdminStats() {
    return this.statsService.getAdminStats();
  }
}
