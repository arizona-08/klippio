import { Body, Injectable, Req, UseGuards } from "@nestjs/common";
import { create } from "domain";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProjectDTO } from "./dtos/create-project.dto";
import { CreateFolderDto } from "./dtos/create-folder.dto";

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService){}

  async createProject(@Body() createProjectDto: CreateProjectDTO, userId: number){
    try{
      const createdProject = await this.prismaService.project.create({
        data: {
          ...createProjectDto,
          authorId: userId
        }
      });

      await this.prismaService.folder.create({
        data: {
          name: "root",
          isRoot: true,
          projectId: createdProject.id
        }
      })

      return createdProject;
    } catch(error) {
      throw new Error("Failed to create project");
    }
  }

  async updateProject(projectId: string, createProjectDto: CreateProjectDTO, userId: number){
    try{
      const project = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        }
      });

      if(!project){
        throw new Error("Project not found");
      }

      if(project.authorId !== userId){
        throw new Error("Unauthorized");
      }

      const updatedProject = await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          ...createProjectDto,
        }
      });

      return updatedProject;
    } catch(error) {
      throw new Error("Failed to update project");
    }
  }

  async getProjects(userId: number){
    try{
      const projects = await this.prismaService.project.findMany({
        where: {
          authorId: userId
        },
        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          zipcode: true,
          
          _count: {
            select: { plans: true}
          },

          plans: {
            select: {
              markers: {
                select: {
                  _count: { select: { markerPhotos: true } }
                }
              }
            }
          }
        },
        orderBy: {lastOpenedAt: "desc"}
      });
      
      const formattedProjects = projects.map((projectItem) => {
      let totalNumberOfPhotos = 0;

      
      for (const planItem of projectItem.plans) {
        for (const markerItem of planItem.markers) {
          totalNumberOfPhotos += markerItem._count.markerPhotos;
        }
      }

      return {
        id: projectItem.id,
        title: projectItem.title,
        address: projectItem.address,
        zipcode: projectItem.zipcode,
        city: projectItem.city,
        numberOfPlans: projectItem._count.plans,
        numberOfPhotos: totalNumberOfPhotos,
      };
    });

    return formattedProjects;
    } catch(error) {
      throw new Error("Failed to get projects");
    }
  }

  async getProjectRootFolder(projectId: string) {
    try {
      const existingProject = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        }
      });

      if (!existingProject) {
        throw new Error("Project not found");
      }

      await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          lastOpenedAt: new Date(),
        }
      });

      const rootFolder = await this.prismaService.folder.findFirst({
        where: {
          projectId,
          isRoot: true,
        },
        include: {
          subfolders: true,
          plans: true,
        }
      });

      if (!rootFolder) {
        throw new Error("Root folder not found for the project");
      }

      return rootFolder;
    } catch (error) {
      throw new Error("Failed to get project root folder");
    }
  }

  async getFolder(folderId: string, projectId: string) {
    try {
      const existingProject = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        }
      });

      if (!existingProject) {
        throw new Error("Project not found");
      }

      await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          lastOpenedAt: new Date(),
        }
      });

      const folder = await this.prismaService.folder.findFirst({
        where: {
          id: folderId,
          projectId,
        },
        include: {
          subfolders: true,
          plans: true,
        }
      });

      if (!folder) {
        throw new Error("Folder not found in the project");
      }

      return folder;
    } catch (error) {
      throw new Error("Failed to get folder");
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

        }
      });

      return newFolder;
    } catch (error) {
      throw new Error("Failed to create folder");
    }
  }

  async deleteFolder(folderId: string, projectId: string) {
    try {
      // Vérifier que le dossier existe et appartient au projet
      const folder = await this.prismaService.folder.findFirst({
        where: {
          id: folderId,
          projectId,
        }
      });

      if (!folder) {
        throw new Error("Folder not found in the project");
      }

      //supprimer le dossier et tous les sous-dossiers/plans dans le S3 et la bdd

      // Supprimer le dossier
      await this.prismaService.folder.delete({
        where: {
          id: folderId,
        }
      });

      return {
        success: true,
        message: "Folder deleted successfully"
      };
    } catch (error) {
      throw new Error("Failed to delete folder");
    }
  }

  async renameFolder(folderId: string, newName: string, projectId: string) {
    try {
      // Vérifier que le dossier existe et appartient au projet
      const folder = await this.prismaService.folder.findFirst({
        where: {
          id: folderId,
          projectId,
        }
      });

      if (!folder) {
        throw new Error("Folder not found in the project");
      }

      // Renommer le dossier
      const updatedFolder = await this.prismaService.folder.update({
        where: {
          id: folderId,
        },
        data: {
          name: newName,
        }
      });

      //renommer le dossier dans le S3

      return updatedFolder;
    } catch (error) {
      throw new Error("Failed to rename folder");
    }
  }
}