import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { MarkerService } from "./marker.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import type { User } from "src/user/interfaces/user.interface";
import { CreateMarkerDto } from "./dtos/create-marker.dto";
import { UpdateMarkerDto } from "./dtos/update-marker.dto";

@Controller('api/markers')
export class MarkerController {
  constructor(
    private readonly markerService: MarkerService
  ) {}

  @Post(':projectId/:planId/marker')
  @UseInterceptors(FilesInterceptor('photos'))
  async addMarker(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('projectId') projectId: string,
    @Param('planId') planId: string,
    @Body('markerData') stringifiedMarkerData: string,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;

    const parsedMarkerData: CreateMarkerDto = JSON.parse(stringifiedMarkerData);
    const result = await this.markerService.addMarker(
      userId,
      projectId,
      planId,
      parsedMarkerData,
      files
    );
    return result;
  }

  @Get(':planId/markers')
  async getMarkers(@Param('planId') planId: string) {
    const markers = await this.markerService.getMarkers(planId);
    return {markers};
  }

  @Put(':projectId/:planId/:markerId')
  @UseInterceptors(FilesInterceptor('newPhotos'))
  async editMarker(
    @Param('projectId') projectId: string,
    @Param('markerId') markerId: string,
    @Body('markerData') stringifiedMarkerData: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    const parsedMarkerData: UpdateMarkerDto = JSON.parse(stringifiedMarkerData);
    const result = await this.markerService.editMarker(userId, projectId, markerId, parsedMarkerData, files);
    return result;
  }

  @Delete(':markerId')
  async deleteMarker( @Param('markerId') markerId: string ) {
    await this.markerService.deleteMarker(markerId);
    return {
      success: true,
      message: 'Marqueur supprimé avec succès'
    };
  }
}