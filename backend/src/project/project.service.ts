import {
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { AmazonS3Service } from 'src/amazon/amazon-s3.service';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly amazonS3Service: AmazonS3Service,
  ) {}

  async createProject(
    @Body() createProjectDto: CreateProjectDTO,
    userId: number,
  ) {
    try {
      const createdProject = await this.prismaService.project.create({
        data: {
          ...createProjectDto,
          authorId: userId,
        },
      });

      await this.prismaService.folder.create({
        data: {
          name: 'root',
          isRoot: true,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    } catch {
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  async getProject(userId: number, projectId: string) {
    try {
      const project = await this.prismaService.project.findFirst({
        where: {
          id: projectId,
          authorId: userId,
        },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return project;
    } catch {
      throw new InternalServerErrorException('Failed to get project');
    }
  }

  async updateProject(
    projectId: string,
    createProjectDto: CreateProjectDTO,
    userId: number,
  ) {
    try {
      const project = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.authorId !== userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const updatedProject = await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          ...createProjectDto,
        },
      });

      return updatedProject;
    } catch {
      throw new InternalServerErrorException('Failed to update project');
    }
  }

  async archiveProject(projectId: string, userId: number) {
    try {
      const project = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.authorId !== userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const archivedProject = await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          isArchived: true,
        },
      });

      return archivedProject;
    } catch {
      throw new InternalServerErrorException('Failed to archive project');
    }
  }

  async unarchiveProject(projectId: string, userId: number) {
    try {
      const project = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.authorId !== userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const unarchivedProject = await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          isArchived: false,
        },
      });

      return unarchivedProject;
    } catch {
      throw new InternalServerErrorException('Failed to unarchive project');
    }
  }

  async deleteProject(projectId: string, userId: number) {
    try {
      const project = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.authorId !== userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const deletedProject = await this.prismaService.project.delete({
        where: {
          id: projectId,
        },
      });

      return {
        success: true,
        message: 'Project deleted successfully',
        deletedProjectTitle: deletedProject.title,
      };
    } catch (error: unknown) {
      console.error(getErrorMessage(error));
      throw new InternalServerErrorException('Failed to delete project');
    }
  }

  async getProjects(
    userId: number,
    sortBy: 'createdAt' | 'lastOpenedAt' | 'title',
    order: 'asc' | 'desc',
    isArchived = false,
  ) {
    try {
      const projects = await this.prismaService.project.findMany({
        where: {
          authorId: userId,
          isArchived: isArchived,
        },
        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          zipcode: true,
          updatedAt: true,
          isArchived: true,
          thumbnailStorageKey: true,
          _count: {
            select: { plans: true },
          },

          plans: {
            select: {
              markers: {
                select: {
                  _count: { select: { markerPhotos: true } },
                },
              },
            },
          },
        },
        orderBy: {
          // lastOpenedAt: "desc"
          [sortBy]: order,
        },
      });

      const formattedProjects = await Promise.all(
        projects.map(async (projectItem) => {
          let totalNumberOfPhotos = 0;

          for (const planItem of projectItem.plans) {
            for (const markerItem of planItem.markers) {
              totalNumberOfPhotos += markerItem._count.markerPhotos;
            }
          }

          const thumbnailTemporaryAccessUrl = projectItem.thumbnailStorageKey
            ? await this.amazonS3Service.generatePresignedUrl(
                projectItem.thumbnailStorageKey,
              )
            : null;

          return {
            id: projectItem.id,
            title: projectItem.title,
            address: projectItem.address,
            zipcode: projectItem.zipcode,
            city: projectItem.city,
            updatedAt: projectItem.updatedAt,
            numberOfPlans: projectItem._count.plans,
            numberOfPhotos: totalNumberOfPhotos,
            thumbnailTemporaryAccessUrl: thumbnailTemporaryAccessUrl,
            isArchived: projectItem.isArchived,
          };
        }),
      );

      return formattedProjects;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get projects');
    }
  }

  async getProjectRootFolder(projectId: string) {
    try {
      const existingProject = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!existingProject) {
        throw new NotFoundException('Project not found');
      }

      await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          lastOpenedAt: new Date(),
        },
      });

      const rootFolder = await this.prismaService.folder.findFirst({
        where: {
          projectId,
          isRoot: true,
        },
        include: {
          subfolders: true,
          plans: true,
        },
      });

      if (!rootFolder) {
        throw new NotFoundException('Root folder not found for the project');
      }

      return rootFolder;
    } catch {
      throw new InternalServerErrorException(
        'Failed to get project root folder',
      );
    }
  }

  async updateProjectThumbnail(
    userId: number,
    projectId: string,
    file: Express.Multer.File,
  ) {
    try {
      const project = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.authorId !== userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      if (project.thumbnailStorageKey) {
        await this.amazonS3Service.deleteImage(project.thumbnailStorageKey);
      }

      const uploadResult = await this.amazonS3Service.uploadImage({
        type: 'PROJECT_THUMBNAIL',
        file,
        userId,
        projectId,
      });

      await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          thumbnailStorageKey: uploadResult.storageKey,
        },
      });

      return {
        success: true,
        message: 'Project thumbnail updated successfully',
        temporaryAccessUrl: uploadResult.temporaryAccessUrl,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'Failed to update project thumbnail',
        getErrorMessage(error),
      );
    }
  }

  /* ----------------- FOLDERS -------------------- */

  async getFolder(folderId: string, projectId: string) {
    try {
      const existingProject = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!existingProject) {
        throw new NotFoundException('Project not found');
      }

      await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          lastOpenedAt: new Date(),
        },
      });

      const folder = await this.prismaService.folder.findFirst({
        where: {
          id: folderId,
          projectId,
        },
        include: {
          subfolders: true,
          plans: true,
        },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found in the project');
      }

      return folder;
    } catch {
      throw new InternalServerErrorException('Failed to get folder');
    }
  }

  async createFolder(createFolderDto: CreateFolderDto, projectId: string) {
    try {
      const { name, parentFolderId } = createFolderDto;

      const newFolder = await this.prismaService.folder.create({
        data: {
          name,
          projectId,
          parentId: parentFolderId,
          isRoot: false,
        },
      });

      return newFolder;
    } catch {
      throw new InternalServerErrorException('Failed to create folder');
    }
  }

  async deleteFolder(folderId: string, projectId: string) {
    try {
      // Vérifier que le dossier existe et appartient au projet
      const folder = await this.prismaService.folder.findFirst({
        where: {
          id: folderId,
          projectId,
        },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found in the project');
      }

      //supprimer le dossier et tous les sous-dossiers/plans dans le S3 et la bdd

      // Supprimer le dossier
      await this.prismaService.folder.delete({
        where: {
          id: folderId,
        },
      });

      return {
        success: true,
        message: 'Folder deleted successfully',
      };
    } catch {
      throw new InternalServerErrorException('Failed to delete folder');
    }
  }

  async renameFolder(folderId: string, newName: string, projectId: string) {
    try {
      // Vérifier que le dossier existe et appartient au projet
      const folder = await this.prismaService.folder.findFirst({
        where: {
          id: folderId,
          projectId,
        },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found in the project');
      }

      // Renommer le dossier
      const updatedFolder = await this.prismaService.folder.update({
        where: {
          id: folderId,
        },
        data: {
          name: newName,
        },
      });

      //renommer le dossier dans le S3

      return updatedFolder;
    } catch {
      throw new InternalServerErrorException('Failed to rename folder');
    }
  }
}
