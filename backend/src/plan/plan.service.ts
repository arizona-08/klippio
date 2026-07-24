import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AmazonS3Service } from 'src/amazon/amazon-s3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlanService {
  constructor(
    private readonly amazonS3Service: AmazonS3Service,
    private readonly prismaService: PrismaService,
  ) {}

  async uploadPlan(
    name: string,
    projectId: string,
    folderId: string,
    userId: number,
    file: Express.Multer.File,
  ) {
    await this.assertProjectAccess(projectId, userId, true);
    await this.assertFolderBelongsToProject(folderId, projectId);

    const { storageKey, temporaryAccessUrl } =
      await this.amazonS3Service.uploadImage({
        type: 'PLAN',
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

      return { ...insertedPlan, temporaryAccessUrl };
    } catch (error) {
      console.error('Error when saving plan info in database: ', error);
      throw new InternalServerErrorException(
        "Erreur lors de l'enregistrement du plan en base de données",
      );
    }
  }

  async getPlan(planId: string, userId: number) {
    const existingPlan = await this.prismaService.plan.findUnique({
      where: { id: planId },
      include: {
        project: {
          select: {
            authorId: true,
            projectCollaborators: {
              where: { userId },
              select: { id: true },
            },
          },
        },
      },
    });

    if (
      !existingPlan ||
      (existingPlan.project.authorId !== userId &&
        existingPlan.project.projectCollaborators.length === 0)
    ) {
      throw new NotFoundException('Plan non trouvé');
    }

    const newTemporaryAccessUrl =
      await this.amazonS3Service.generatePresignedUrl(
        existingPlan.documentStorageKey,
        3600,
      );

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
    };
  }

  async getPlanById(projectId: string, planId: string, userId: number) {
    const existingPlan = await this.prismaService.plan.findFirst({
      where: {
        id: planId,
        projectId,
        project: {
          OR: [
            { authorId: userId },
            { projectCollaborators: { some: { userId } } },
          ],
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!existingPlan) {
      throw new NotFoundException('Plan non trouvé');
    }

    const newTemporaryAccessUrl =
      await this.amazonS3Service.generatePresignedUrl(
        existingPlan.documentStorageKey,
        3600,
      );

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
      project: existingPlan.project,
    };
  }

  async getLastOpenedPlan(projectId: string, userId: number) {
    await this.assertProjectAccess(projectId, userId);

    const lastOpenedPlan = await this.prismaService.plan.findFirst({
      where: { projectId },
      orderBy: { lastOpenedAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },

        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!lastOpenedPlan) {
      return null;
    }

    const newTemporaryAccessUrl =
      await this.amazonS3Service.generatePresignedUrl(
        lastOpenedPlan.documentStorageKey,
        3600,
      );

    return {
      id: lastOpenedPlan.id,
      name: lastOpenedPlan.name,
      documentStorageKey: lastOpenedPlan.documentStorageKey,
      temporaryAccessUrl: newTemporaryAccessUrl,
      project: lastOpenedPlan.project,
      folder: lastOpenedPlan.folder,
    };
  }

  async renamePlan(
    planId: string,
    newName: string,
    projectId: string,
    userId: number,
  ) {
    try {
      const existingPlan = await this.prismaService.plan.findFirst({
        where: {
          id: planId,
          projectId,
          project: this.projectAccessWhere(userId, true),
        },
      });

      if (!existingPlan) {
        throw new NotFoundException('Plan non trouvé');
      }

      const updatedPlan = await this.prismaService.plan.update({
        where: { id: planId },
        data: { name: newName },
      });

      return updatedPlan;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error when renaming plan: ', error);
      throw new InternalServerErrorException(
        'Erreur lors du renommage du plan',
      );
    }
  }

  private async assertProjectAccess(
    projectId: string,
    userId: number,
    requiresEditor = false,
  ) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        ...this.projectAccessWhere(userId, requiresEditor),
      },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }
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

  private async assertFolderBelongsToProject(
    folderId: string,
    projectId: string,
  ) {
    const folder = await this.prismaService.folder.findFirst({
      where: { id: folderId, projectId },
      select: { id: true },
    });

    if (!folder) {
      throw new NotFoundException('Dossier non trouvé');
    }
  }
}
