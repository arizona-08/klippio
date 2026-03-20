import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AmazonS3Service } from "src/amazon/amazon-s3.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PlanService {
  constructor(private readonly amazonS3Service: AmazonS3Service, private readonly prismaService: PrismaService){}

  async uploadPlan(name: string, projectId: string, userId: number, file: Express.Multer.File) {
    const { fileUrl, temporaryAccessUrl } = await this.amazonS3Service.uploadImage({
      type: "PLAN",
      file,
      userId,
      projectId,
    });


    try {
      const insertedPlan = await this.prismaService.plan.create({
        data: {
          projectId,
          documentStorageKey: fileUrl,
          temporaryAccessUrl,
          name,
        },
      });

      return {...insertedPlan, temporaryAccessUrl};
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de l'enregistrement du plan en base de données");
    }
  }
}