import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { CreatePhotoReportDto } from './dto/create-photo-report.dto';
import { PhotoReportService } from './photo-report.service';

@UseGuards(AuthenticatedGuard)
@Controller('api/photo-reports')
export class PhotoReportController {
  constructor(private readonly photoReportService: PhotoReportService) {}

  @Post()
  create(@Body() dto: CreatePhotoReportDto, @CurrentUser() user: User) {
    return this.photoReportService.create(dto.photoId, user.id, dto.reason);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.photoReportService.findAll();
  }

  @Post(':id/remove-and-warn')
  @UseGuards(AdminGuard)
  removeAndWarn(@Param('id') id: string) {
    return this.photoReportService.removePhotoAndNotifyUploader(id);
  }

  @Post(':id/remove-and-ban')
  @UseGuards(AdminGuard)
  removeAndBan(@Param('id') id: string, @CurrentUser() user: User) {
    return this.photoReportService.removePhotoAndBanUploader(id, user.id);
  }
}
