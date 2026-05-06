import { Body, Controller, Put, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { EditPersonalInfoDto } from "./dtos/edit-personal-info.dto";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import type { User } from "src/user/interfaces/user.interface";
import { EditPasswordDto } from "./dtos/edit-password.dto";

@UseGuards(AuthenticatedGuard)
@Controller('api/profile')
export  class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put("edit-personal-info")
  async editPersonalInfo(@Body() body: EditPersonalInfoDto, @CurrentUser() user: User) {
    const updatedUser = await this.profileService.editPersonalInfo(user.id, body);
    return updatedUser;
  }

  @Put("edit-password")
  async editPasswordInfo(@Body() body: EditPasswordDto, @CurrentUser() user: User) {
    const updatedUser = await this.profileService.editPasswordInfo(user.id, body);
    return updatedUser;
  }
}