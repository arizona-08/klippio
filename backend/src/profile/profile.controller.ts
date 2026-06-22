import {
  Body,
  Controller,
  Patch,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { EditPersonalInfoDto } from './dtos/edit-personal-info.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { EditPasswordDto } from './dtos/edit-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditUserPictureDto } from './dtos/edit-profile-picture.dto';

@UseGuards(AuthenticatedGuard)
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('edit-personal-info')
  async editPersonalInfo(
    @Body() body: EditPersonalInfoDto,
    @CurrentUser() user: User,
  ) {
    const updatedUser = await this.profileService.editPersonalInfo(
      user.id,
      body,
    );
    return updatedUser;
  }

  @Put('edit-password')
  async editPasswordInfo(
    @Body() body: EditPasswordDto,
    @CurrentUser() user: User,
  ) {
    const updatedUser = await this.profileService.editPasswordInfo(
      user.id,
      body,
    );
    return updatedUser;
  }

  @Patch('edit-user-picture')
  @UseInterceptors(FileInterceptor('file'))
  async editUserPicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: EditUserPictureDto,
    @CurrentUser() user: User,
  ) {
    const updatedUser = await this.profileService.editUserPicture(
      user.id,
      file,
      body,
    );
    return updatedUser;
  }
}
