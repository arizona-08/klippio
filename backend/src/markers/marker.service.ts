import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AmazonS3Service } from 'src/amazon/amazon-s3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateMarkerDto } from './dtos/create-marker.dto';
import { UpdateMarkerDto } from './dtos/update-marker.dto';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

@Injectable()
export class MarkerService {
  constructor(
    private readonly amazonS3Service: AmazonS3Service,
    private readonly prismaService: PrismaService,
  ) {}

  async addMarker(
    userId: number,
    projectId: string,
    planId: string,
    pageNumber: number,
    markerData: CreateMarkerDto,
    files: Express.Multer.File[],
  ) {
    try {
      await this.assertPlanAccess(projectId, planId, userId, true);

        const createdMarker = await this.prismaService.$transaction(async (prisma) => {
          const plan = await prisma.plan.update({
          where: { id: planId },
          data: {
              nextMarkerNumber: {
                  increment: 1,
              },
          },
          select: {
              nextMarkerNumber: true,
          },
        });
        
        const insertedMarker = await prisma.marker.create({
          data: {
            markerNumber: plan.nextMarkerNumber,
            title: markerData.title,
            coordX: markerData.coordX,
            coordY: markerData.coordY,
            planId,
            planPageNumber: pageNumber,
          },
        });

        const markerPhotosData = await Promise.all(
          markerData.photosMetaData.map(async (photoMetaData, index) => {
            const file = files[index];
            const { storageKey, temporaryAccessUrl } =
              await this.amazonS3Service.uploadImage({
                type: 'MARKER_PICTURE',
                file,
                userId,
                projectId,
                markerId: insertedMarker.id,
              });

            return {
              label: photoMetaData.label,
              comment: photoMetaData.comment,
              storageKey,
              temporaryAccessUrl,
            };
          }),
        );

        await prisma.markerPhoto.createMany({
          data: markerPhotosData.map((photo) => ({
            photoLabel: photo.label,
            comment: photo.comment,
            photoStorageKey: photo.storageKey,
            temporaryAccessUrl: photo.temporaryAccessUrl,
            markerId: insertedMarker.id,
          })),
        });

        return {
          ...insertedMarker,
          coordX: insertedMarker.coordX,
          coordY: insertedMarker.coordY,
          photos: markerPhotosData,
        };
      })

      return {
        ...createdMarker,
      }
      
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error when adding marker and its photos : ' + getErrorMessage(error),
      );
    }
  }

  async getMarkers(planId: string, pageNumber: number, userId: number) {
    await this.assertPlanAccessByPlanId(planId, userId);

    const markers = await this.prismaService.marker.findMany({
      where: { planId, planPageNumber: pageNumber },
      include: {
        markerPhotos: true,
      },
    });

    const updatedMarkers = await Promise.all(
      markers.map(async (marker) => {
        const updatedPhotos = await Promise.all(
          marker.markerPhotos.map(async (photo) => {
            const newTemporaryAccessUrl =
              await this.amazonS3Service.generatePresignedUrl(
                photo.photoStorageKey,
                3600,
              );
            return {
              ...photo,
              label: photo.photoLabel,
              temporaryAccessUrl: newTemporaryAccessUrl,
            };
          }),
        );

        return {
          ...marker,
          coordX: marker.coordX,
          coordY: marker.coordY,
          photos: updatedPhotos,
        };
      }),
    );

    return updatedMarkers;
  }

  async editMarker(
    userId: number,
    projectId: string,
    planId: string,
    markerId: string,
    markerData: UpdateMarkerDto,
    files: Express.Multer.File[],
  ) {
    //update des données du marker
    try {
      await this.assertMarkerAccess(markerId, planId, projectId, userId, true);

      const updatedMarker = await this.prismaService.marker.update({
        where: { id: markerId },
        data: {
          title: markerData.title,
          coordX: markerData.coordX,
          coordY: markerData.coordY,
        },
      });

      const updatedExistingPhotos = await Promise.all(
        (markerData.existingPhotosToUpdate ?? []).map(async (photo) => {
          const existingPhoto = await this.prismaService.markerPhoto.findFirst({
            where: { id: photo.identifier, markerId },
            select: { id: true },
          });

          if (!existingPhoto) {
            throw new NotFoundException('Photo non trouvée');
          }

          const updatedPhoto = await this.prismaService.markerPhoto.update({
            where: { id: photo.identifier },
            data: {
              photoLabel: photo.label,
              comment: photo.comment,
            },
          });

          const newTemporaryAccessUrl =
            await this.amazonS3Service.generatePresignedUrl(
              updatedPhoto.photoStorageKey,
              3600,
            );

          return {
            ...updatedPhoto,
            label: updatedPhoto.photoLabel,
            temporaryAccessUrl: newTemporaryAccessUrl,
          };
        }),
      );

      // Suppression des photos supprimées
      if (markerData.deletedPhotoIdentifiers?.length) {
        const photosToDelete = await this.prismaService.markerPhoto.findMany({
          where: {
            id: { in: markerData.deletedPhotoIdentifiers },
            markerId,
          },
        });

        await Promise.all(
          photosToDelete.map((photo) =>
            this.amazonS3Service.deleteImage(photo.photoStorageKey),
          ),
        );

        await this.prismaService.markerPhoto.deleteMany({
          where: {
            id: { in: markerData.deletedPhotoIdentifiers },
            markerId,
          },
        });
      }

      // Ajout des nouvelles photos
      const newPhotosData = await Promise.all(
        (markerData.newPhotosMetadata ?? []).map(
          async (photoMetaData, index) => {
            const file = files[index];
            const { storageKey, temporaryAccessUrl } =
              await this.amazonS3Service.uploadImage({
                type: 'MARKER_PICTURE',
                file,
                userId, // Pass the user ID if necessary
                projectId, // Pass the project ID if necessary
                markerId,
              });

            const insertedPhoto = await this.prismaService.markerPhoto.create({
              data: {
                photoLabel: photoMetaData.label,
                comment: photoMetaData.comment,
                photoStorageKey: storageKey,
                temporaryAccessUrl: temporaryAccessUrl,
                markerId,
              },
            });

            return {
              ...insertedPhoto,
              label: insertedPhoto.photoLabel,
            };
          },
        ),
      );

      return {
        success: true,
        message: 'Marker updated successfully',
        updatedMarker: {
          ...updatedMarker,
          coordX: updatedMarker.coordX,
          coordY: updatedMarker.coordY,
          photos: [...updatedExistingPhotos, ...newPhotosData],
        },
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error in editMarker service method: ', error);
      throw new InternalServerErrorException(
        'Error when editing marker and its photos : ' + getErrorMessage(error),
      );
    }
  }

  async deleteMarker(markerId: string, userId: number) {
    try {
      const marker = await this.assertMarkerAccessByMarkerId(markerId, userId, true);

      await this.prismaService.markerPhoto.deleteMany({
        where: { markerId },
      });

      await this.prismaService.marker.delete({
        where: { id: markerId },
      });

      return {
        id: marker.id,
        planId: marker.planId,
        planPageNumber: marker.planPageNumber,
        projectId: marker.plan.projectId,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error when deleting marker and its photos : ' + getErrorMessage(error),
      );
    }
  }

  private async assertPlanAccess(
    projectId: string,
    planId: string,
    userId: number,
    requiresEditor = false,
  ) {
    const plan = await this.prismaService.plan.findFirst({
      where: {
        id: planId,
        projectId,
        project: this.projectAccessWhere(userId, requiresEditor),
      },
      select: { id: true },
    });

    if (!plan) {
      throw new NotFoundException('Plan non trouvé');
    }
  }

  private async assertPlanAccessByPlanId(planId: string, userId: number) {
    const plan = await this.prismaService.plan.findFirst({
      where: {
        id: planId,
        project: this.projectAccessWhere(userId),
      },
      select: { id: true },
    });

    if (!plan) {
      throw new NotFoundException('Plan non trouvé');
    }
  }

  private async assertMarkerAccess(
    markerId: string,
    planId: string,
    projectId: string,
    userId: number,
    requiresEditor = false,
  ) {
    const marker = await this.prismaService.marker.findFirst({
      where: {
        id: markerId,
        planId,
        plan: {
          projectId,
          project: this.projectAccessWhere(userId, requiresEditor),
        },
      },
      select: { id: true },
    });

    if (!marker) {
      throw new NotFoundException('Marqueur non trouvé');
    }

    return marker;
  }

  private async assertMarkerAccessByMarkerId(
    markerId: string,
    userId: number,
    requiresEditor = false,
  ) {
    const marker = await this.prismaService.marker.findFirst({
      where: {
        id: markerId,
        plan: {
          project: this.projectAccessWhere(userId, requiresEditor),
        },
      },
      select: {
        id: true,
        planId: true,
        planPageNumber: true,
        plan: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (!marker) {
      throw new NotFoundException('Marqueur non trouvé');
    }

    return marker;
  }

  private projectAccessWhere(
    userId: number,
    requiresEditor = false,
  ): Prisma.ProjectWhereInput {
    return {
      OR: [
        { authorId: userId },
        {
          projectCollaborators: {
            some: requiresEditor ? { userId, role: 'EDITOR' } : { userId },
          },
        },
      ],
    };
  }
}
