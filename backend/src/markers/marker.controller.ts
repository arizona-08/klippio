import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MarkerService } from './marker.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { CreateMarkerDto } from './dtos/create-marker.dto';
import { UpdateMarkerDto } from './dtos/update-marker.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { validateUploadedFiles } from 'src/uploads/validate-upload';
import { parseJsonDto } from 'src/validation/parse-json-dto';

@UseGuards(AuthenticatedGuard)
@Controller('api/markers')
export class MarkerController {
  constructor(private readonly markerService: MarkerService) {}

  @Post(':projectId/:planId/marker')
  @UseInterceptors(
    FilesInterceptor('photos', 10, { limits: { fileSize: 5_000_000 } }),
  )
  async addMarker(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('projectId') projectId: string,
    @Param('planId') planId: string,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Body('markerData') stringifiedMarkerData: string,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;

    const parsedMarkerData = parseJsonDto(
      stringifiedMarkerData,
      CreateMarkerDto,
    );

    if (pageNumber < 1) {
      throw new BadRequestException('Numéro de page invalide');
    }

    if (parsedMarkerData.photosMetaData.length !== (files?.length ?? 0)) {
      throw new BadRequestException('Métadonnées photos incohérentes');
    }

    if (files?.length) {
      validateUploadedFiles(files, {
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        maxFiles: 10,
        maxSizeInBytes: 5_000_000,
      });
    }

    const result = await this.markerService.addMarker(
      userId,
      projectId,
      planId,
      pageNumber,
      parsedMarkerData,
      files ?? [],
    );
    return result;
  }

  @Get(':planId/markers')
  async getMarkers(
    @Param('planId') planId: string,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @CurrentUser() user: User,
  ) {
    if (pageNumber < 1) {
      throw new BadRequestException('Numéro de page invalide');
    }

    const markers = await this.markerService.getMarkers(
      planId,
      pageNumber,
      user.id,
    );
    return { markers };
  }

  @Put(':projectId/:planId/:markerId')
  @UseInterceptors(
    FilesInterceptor('newPhotos', 10, { limits: { fileSize: 5_000_000 } }),
  )
  async editMarker(
    @Param('projectId') projectId: string,
    @Param('planId') planId: string,
    @Param('markerId') markerId: string,
    @Body('markerData') stringifiedMarkerData: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    const parsedMarkerData = parseJsonDto(
      stringifiedMarkerData,
      UpdateMarkerDto,
    );

    if (parsedMarkerData.newPhotosMetadata.length !== (files?.length ?? 0)) {
      throw new BadRequestException('Métadonnées photos incohérentes');
    }

    if (files?.length) {
      validateUploadedFiles(files, {
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        maxFiles: 10,
        maxSizeInBytes: 5_000_000,
      });
    }

    const result = await this.markerService.editMarker(
      userId,
      projectId,
      planId,
      markerId,
      parsedMarkerData,
      files ?? [],
    );
    return result;
  }

  @Delete(':markerId')
  async deleteMarker(
    @Param('markerId') markerId: string,
    @CurrentUser() user: User,
  ) {
    await this.markerService.deleteMarker(markerId, user.id);
    return {
      success: true,
      message: 'Marqueur supprimé avec succès',
    };
  }
}
