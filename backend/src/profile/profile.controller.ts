import {
  Body,
  Controller,
  Delete,
  Patch,
  Put,
  Session,
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
import { validateUploadedFile } from 'src/uploads/validate-upload';

type AuthSession = {
  destroy: (callback?: (err?: Error) => void) => void;
};

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

  @Delete('account')
  async deleteAccount(
    @CurrentUser() user: User,
    @Session() session: AuthSession,
  ) {
    const result = await this.profileService.deleteAccount(user.id);
    session.destroy();
    return result;
  }

  @Patch('edit-user-picture')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5_000_000 } }))
  async editUserPicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: EditUserPictureDto,
    @CurrentUser() user: User,
  ) {
    validateUploadedFile(file, {
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      maxSizeInBytes: 5_000_000,
    });

    const updatedUser = await this.profileService.editUserPicture(
      user.id,
      file,
      body,
    );
    return updatedUser;
  }
}
