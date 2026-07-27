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
import { RealtimeService } from 'src/realtime/realtime.service';

@UseGuards(AuthenticatedGuard)
@Controller('api/markers')
export class MarkerController {
  constructor(
    private readonly markerService: MarkerService,
    private readonly realtimeService: RealtimeService,
  ) {}

  @Post(':projectId/:planId/marker')
  @UseInterceptors(
    FilesInterceptor('photos', 10, { limits: { fileSize: 5_000_000 } }),
  )
  async addMarker(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('projectId') projectId: string,
    @Param('planId') planId: string,
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Body() markerData: CreateMarkerDto,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;

    if (pageNumber < 1) {
      throw new BadRequestException('Numéro de page invalide');
    }

    if (markerData.photosMetaData.length !== (files?.length ?? 0)) {
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
      markerData,
      files ?? [],
    );
    this.realtimeService.emitToProject(projectId, 'marker:created', {
      projectId,
      planId,
      pageNumber,
      marker: result,
      actorId: userId,
    });
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
    @Body() markerData: UpdateMarkerDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    const userId = user.id;

    if ((markerData.newPhotosMetadata?.length ?? 0) !== (files?.length ?? 0)) {
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
      markerData,
      files ?? [],
    );
    this.realtimeService.emitToProject(projectId, 'marker:updated', {
      projectId,
      planId,
      pageNumber: result.updatedMarker.planPageNumber,
      marker: result.updatedMarker,
      actorId: userId,
    });
    return result;
  }

  @Delete(':markerId')
  async deleteMarker(
    @Param('markerId') markerId: string,
    @CurrentUser() user: User,
  ) {
    const deletedMarker = await this.markerService.deleteMarker(
      markerId,
      user.id,
    );
    this.realtimeService.emitToProject(deletedMarker.projectId, 'marker:deleted', {
      projectId: deletedMarker.projectId,
      planId: deletedMarker.planId,
      pageNumber: deletedMarker.planPageNumber,
      markerId,
      actorId: user.id,
    });
    return {
      success: true,
      message: 'Marqueur supprimé avec succès',
    };
  }
}
