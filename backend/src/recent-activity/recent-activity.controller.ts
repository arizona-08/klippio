import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RecentActivityService } from "./recent-activyty.service";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { CreateRecentActivityDto } from "./dtos/create-recent-activity.dto";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import type { User } from "src/user/interfaces/user.interface";

@UseGuards(AuthenticatedGuard)
@Controller("api/recent-activity")
export class RecentActivityController {
  constructor(private readonly recentActivityService: RecentActivityService) {}

  @Post()
  createRecentActivity(@Body() body: CreateRecentActivityDto) {
    return this.recentActivityService.createRecentActivity(body);
  }

  @Get()
  getRecentActivities(@CurrentUser() user: User) {
    return this.recentActivityService.getRecentActivities(user.id);
  }

}