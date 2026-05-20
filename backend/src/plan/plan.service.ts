import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AmazonS3Service } from "src/amazon/amazon-s3.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMarkerDto } from "./dtos/markers/create-marker.dto";
import { UpdateMarkerDto } from "./dtos/markers/update-marker.dto";

@Injectable()
export class PlanService {
  constructor(private readonly amazonS3Service: AmazonS3Service, private readonly prismaService: PrismaService){}

  async uploadPlan(name: string, projectId: string, folderId: string,  userId: number, file: Express.Multer.File) {
    const { storageKey, temporaryAccessUrl } = await this.amazonS3Service.uploadImage({
      type: "PLAN",
      file,
      userId,
      projectId,
    });


    try {
      const insertedPlan = await this.prismaService.plan.create({
        data: {
          projectId,
          documentStorageKey: storageKey,
          temporaryAccessUrl,
          name,
          folderId,
        },
      });

      return {...insertedPlan, temporaryAccessUrl};
    } catch (error) {
      console.error("Error when saving plan info in database: ", error);
      throw new InternalServerErrorException("Erreur lors de l'enregistrement du plan en base de données");
    }
  }

  async getPlan(planId: string) {
    const existingPlan = await this.prismaService.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      throw new InternalServerErrorException("Plan non trouvé");
    }

    const newTemporaryAccessUrl = await this.amazonS3Service.generatePresignedUrl(existingPlan.documentStorageKey, 3600);

    const updatedPlan = await this.prismaService.plan.update({
      where: { id: planId },
      data: { 
        temporaryAccessUrl: newTemporaryAccessUrl,
        lastOpenedAt: new Date(), // Met à jour la date de dernière ouverture
      },
    });

    return {
      id: updatedPlan.id,
      name: updatedPlan.name,
      documentStorageKey: updatedPlan.documentStorageKey,
      temporaryAccessUrl: updatedPlan.temporaryAccessUrl,
    }
  }

  async getLastOpenedPlan(projectId: string) {
    const lastOpenedPlan = await this.prismaService.plan.findFirst({
      where: { projectId },
      orderBy: { lastOpenedAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          }
        },

        folder: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!lastOpenedPlan) {
      return null; // Ou gérer le cas où aucun plan n'est trouvé selon les besoins de ton application
    }

    const newTemporaryAccessUrl = await this.amazonS3Service.generatePresignedUrl(lastOpenedPlan.documentStorageKey, 3600);

    return {
      id: lastOpenedPlan.id,
      name: lastOpenedPlan.name,
      documentStorageKey: lastOpenedPlan.documentStorageKey,
      temporaryAccessUrl: newTemporaryAccessUrl,
      project: lastOpenedPlan.project,
      folder: lastOpenedPlan.folder,
    };
   }

  
   async renamePlan(planId: string, newName: string, projectId: string) {
    try {
      const updatedPlan = await this.prismaService.plan.update({
        where: { id: planId, projectId },
        data: { name: newName },
      });

      return updatedPlan;
    } catch (error) {
      console.error("Error when renaming plan: ", error);
      throw new InternalServerErrorException("Erreur lors du renommage du plan");
    }
  }


  //  --------------------------MARKERS------------------------------

  async addMarker(
    userId: number,
    projectId: string,
    planId: string,
    markerData: CreateMarkerDto,
    files: Express.Multer.File[]
  ) {
    try{
      const insertedMarker = await this.prismaService.marker.create({
        data: {
          title: markerData.title,
          coordX: markerData.coordX,
          coordY: markerData.coordY,
          planId,
        }
      });

      const markerPhotosData = await Promise.all(markerData.photosMetaData.map(async (photoMetaData, index) => {
        const file = files[index];
        const { storageKey, temporaryAccessUrl } = await this.amazonS3Service.uploadImage({
          type: "MARKER_PICTURE",
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
      }));

      await this.prismaService.markerPhoto.createMany({
        data: markerPhotosData.map(photo => ({
          photoLabel: photo.label,
          comment: photo.comment,
          photoStorageKey: photo.storageKey,
          temporaryAccessUrl: photo.temporaryAccessUrl,
          markerId: insertedMarker.id,
        }))
      });

      return { 
        ...insertedMarker,
        coordX: insertedMarker.coordX,
        coordY: insertedMarker.coordY,
        photos: markerPhotosData
      };
    } catch (error: any) {
      throw new InternalServerErrorException("Error when adding marker and its photos : " + error.message);
    }
  }

  async getMarkers(planId: string) {
    const markers = await this.prismaService.marker.findMany({
      where: { planId },
      include: {
        markerPhotos: true
      }
    });

    const updatedMarkers = await Promise.all(markers.map(async (marker) => {
      const updatedPhotos = await Promise.all(marker.markerPhotos.map(async (photo) => {
        const newTemporaryAccessUrl = await this.amazonS3Service.generatePresignedUrl(photo.photoStorageKey, 3600);
        return {
          ...photo,
          label: photo.photoLabel,
          temporaryAccessUrl: newTemporaryAccessUrl,
        }
      }));
    
      return {
        ...marker,
        coordX: marker.coordX,
        coordY: marker.coordY,
        photos: updatedPhotos,
      }
    }));

    return updatedMarkers;

  }

  async editMarker(userId: number, projectId: string, markerId: string, markerData: UpdateMarkerDto, files: Express.Multer.File[]) {
    //update des données du marker
    try {
      const updatedMarker = await this.prismaService.marker.update({
        where: { id: markerId },
        data: {
          title: markerData.title,
          coordX: markerData.coordX,
          coordY: markerData.coordY,
        }
      });

      
      const updatedExistingPhotos = await Promise.all(markerData.existingPhotosToUpdate.map(async (photo) => {
        const updatedPhoto = await this.prismaService.markerPhoto.update({
          where: { id: photo.identifier },
          data: {
            photoLabel: photo.label,
            comment: photo.comment,
          }
        });

        const newTemporaryAccessUrl = await this.amazonS3Service.generatePresignedUrl(updatedPhoto.photoStorageKey, 3600);

        return {
          ...updatedPhoto,
          label: updatedPhoto.photoLabel,
          temporaryAccessUrl: newTemporaryAccessUrl,
        };
      }));

      // Suppression des photos supprimées
      if (markerData.deletedPhotoIdentifiers) {
        console.log(markerData.deletedPhotoIdentifiers);
        
        const photosToDelete = await this.prismaService.markerPhoto.findMany({
          where: {
            id: { in: markerData.deletedPhotoIdentifiers },
            markerId,
          }
        });

        await Promise.all(photosToDelete.map(photo => 
          this.amazonS3Service.deleteImage(photo.photoStorageKey)
        ));

        await this.prismaService.markerPhoto.deleteMany({
          where: {
            id: { in: markerData.deletedPhotoIdentifiers },
            markerId,
          }
        });
      }

      // Ajout des nouvelles photos
      const newPhotosData = await Promise.all(markerData.newPhotosMetadata.map(async (photoMetaData, index) => {
        const file = files[index];
        const { storageKey, temporaryAccessUrl } = await this.amazonS3Service.uploadImage({
          type: "MARKER_PICTURE",
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
          }
        });

        return {
          ...insertedPhoto,
          label: insertedPhoto.photoLabel,
        };
      }));

      return {
        success: true,
        message: 'Marker updated successfully',
        updatedMarker: {
          ...updatedMarker,
          coordX: updatedMarker.coordX,
          coordY: updatedMarker.coordY,
          photos: [...updatedExistingPhotos, ...newPhotosData],
        }
      };
    } catch (error: any) {
      console.error("Error in editMarker service method: ", error);
      throw new InternalServerErrorException("Error when editing marker and its photos : " + error.message);
    }
  }

  async deleteMarker(markerId: string) {
    try{
      await this.prismaService.markerPhoto.deleteMany({
        where: { markerId },
      });

      await this.prismaService.marker.delete({
        where: { id: markerId },
      });
    } catch (error: any) {
      throw new InternalServerErrorException("Error when deleting marker and its photos : " + error.message);
    }
    
  }
}