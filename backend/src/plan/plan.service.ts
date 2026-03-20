import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AmazonS3Service } from "src/amazon/amazon-s3.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PlanService {
  constructor(private readonly amazonS3Service: AmazonS3Service, private readonly prismaService: PrismaService){}

  async uploadPlan(name: string, projectId: string, userId: number, file: Express.Multer.File) {
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
        },
      });

      return {...insertedPlan, temporaryAccessUrl};
    } catch (error) {
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
      data: { temporaryAccessUrl: newTemporaryAccessUrl },
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
    };
   }
}