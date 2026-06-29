import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { AmazonS3Service } from 'src/amazon/amazon-s3.service';
import { MailerOptionInterface } from 'src/mail/interfaces/MailerOptionInterface';
import { MailService } from 'src/mail/mail.service';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function rethrowKnownHttpException(error: unknown) {
  if (error instanceof HttpException) {
    throw error;
  }
}

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly amazonS3Service: AmazonS3Service,
    private readonly mailService: MailService
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

      await this.prismaService.projectCollaborator.create({
        data: {
          projectId: createdProject.id,
          userId: userId,
          role: 'OWNER',
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
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  async getProject(userId: number, projectId: string) {
    try {
      const project = await this.findProjectWithAccess(projectId, userId);

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return project;
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
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
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
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
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
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
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
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
      rethrowKnownHttpException(error);
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
          OR: [
            { authorId: userId },
            { projectCollaborators: { some: { userId } } },
          ],
          isArchived: isArchived,
        },
        select: {
          id: true,
          authorId: true,
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
          title: true,
          address: true,
          city: true,
          zipcode: true,
          updatedAt: true,
          isArchived: true,
          thumbnailStorageKey: true,
          projectCollaborators: {
            select: {
              role: true,
              user: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  email: true,
                }
              }
            }
          },
          projectInvitations: {
            select: {
              email: true,
              role: true,
              status: true,
              createdAt: true
            }
          },
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
            authorId: projectItem.authorId,
            author: projectItem.author,
            title: projectItem.title,
            address: projectItem.address,
            zipcode: projectItem.zipcode,
            city: projectItem.city,
            updatedAt: projectItem.updatedAt,
            numberOfPlans: projectItem._count.plans,
            numberOfPhotos: totalNumberOfPhotos,
            thumbnailTemporaryAccessUrl: thumbnailTemporaryAccessUrl,
            isArchived: projectItem.isArchived,
            collaborators: projectItem.projectCollaborators,
            invitations:
              projectItem.authorId === userId
                ? projectItem.projectInvitations.filter((invitation) =>
                    ['PENDING', 'DECLINED'].includes(invitation.status),
                  )
                : [],
          };
        }),
      );

      return formattedProjects;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get projects');
    }
  }

  async getProjectRootFolder(projectId: string, userId: number) {
    try {
      const existingProject = await this.findProjectWithAccess(projectId, userId);

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
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
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
      const project = await this.findProjectWithAccess(projectId, userId);

      if (!project) {
        throw new NotFoundException('Project not found');
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
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException(
        'Failed to update project thumbnail',
        getErrorMessage(error),
      );
    }
  }

  async generateInvitationLink(projectId: string, userId: number, invitedEmail: string, invitedRole: 'VIEWER' | 'EDITOR') {
    try {
      const project = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
        include: {
          author: {
            select: {
              firstname: true,
              lastname: true,
              email: true
            }
          }
        }
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.authorId !== userId) {
        throw new UnauthorizedException('Unauthorized');
      }

      // Generate a unique invitation token (you can use a library like uuid)
      const invitationToken = crypto.randomUUID();

      // Store the invitation token in the database with an expiration date
      const invitation = await this.prismaService.projectInvitation.create({
        data: {
          projectId,
          email: invitedEmail,
          role: invitedRole,
          token: invitationToken,
          expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        },
      });

      // Return the invitation link (you can customize the URL as needed)
      const invitationLink = `${process.env.FRONTEND_URL}/invite/${invitationToken}`;

      const mail: MailerOptionInterface = {
        from: process.env.SMTP_FROM as string,
        to: invitedEmail,
        subject: "Invitation à collaborer sur le projet",
        html: `
          <p>Bonjour,</p>
          <p>${project.author.firstname} ${project.author.lastname} vous a invité à collaborer sur le projet "${project.title}".</p>
          <p>Veuillez cliquer sur le lien ci-dessous pour accepter l'invitation :</p>
          <a href="${invitationLink}">Accepter l'invitation</a>
          <p>Cordialement,<br/>Team Klippio</p>
        `,
      };

      await this.mailService.sendMail(mail);

      return {
        success: true,
        message: 'Invitation link generated successfully',
        invitation: invitation,
      };
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException(
        'Failed to generate invitation link',
        getErrorMessage(error),
      );
    }
  }

  async getInvitationDetails(invitationToken: string) {
    try {
      const invitation = await this.prismaService.projectInvitation.findUnique({
        where: {
          token: invitationToken,
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              address: true,
              city: true,
              zipcode: true,
              author: {
                select: {
                  firstname: true,
                  lastname: true,
                  email: true
                }
              }
            }
          },
        },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      return {
        invitation
      }
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException(
        'Failed to get invitation details',
        getErrorMessage(error),
      );
    }
  }

  async denyInvitation(invitationToken: string) {
    try {

      const invitation = await this.prismaService.projectInvitation.findUnique({
        where: {
          token: invitationToken,
        },
        select: {
          email: true,
          expiresAt: true,
          status: true,
          project: {
            select: {
              title: true,
              author: {
                select: {
                  firstname: true,
                  lastname: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.expiresAt < new Date()) {
        throw new UnauthorizedException('Invitation has expired');
      }

      if (invitation.status === 'ACCEPTED') {
        throw new BadRequestException('Invitation has already been accepted');
      }

      await this.prismaService.projectInvitation.update({
        where: {
          token: invitationToken
        },
        data: {
          status: 'DECLINED'
        }
      })

      const {expiresAt, ...invitationData} = invitation;
      await this.sendDeniedInvitationEmail(invitationData);

      return {
        success: true,
      }
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException(
        'Failed to deny invitation',
        getErrorMessage(error),
      );
    }
    
  }

  async addCollaboratorToProject(invitationToken: string, userId: number){
    try{
      const invitation = await this.prismaService.projectInvitation.findUnique({
        where: {
          token: invitationToken,
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

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.expiresAt < new Date()) {
        throw new UnauthorizedException('Invitation has expired');
      }

      if (invitation.status === 'DECLINED') {
        throw new BadRequestException('Invitation has been declined');
      }

      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
        },
      });

      if (!user || user.email !== invitation.email) {
        throw new UnauthorizedException(
          "Cette invitation est liée à une autre adresse email",
        );
      }

      const existingCollaborator = await this.prismaService.projectCollaborator.findFirst({
        where: {
          projectId: invitation.projectId,
          userId: user.id,
        },
      });

      if (!existingCollaborator) {
        await this.prismaService.projectCollaborator.create({
          data: {
            projectId: invitation.projectId,
            userId: user.id,
            role: invitation.role,
          },
        });
      }

      await this.prismaService.projectInvitation.update({
        where: {
          token: invitationToken,
        },
        data: {
          status: 'ACCEPTED',
        },
      });

      return {
        success: true,
        projectId: invitation.projectId,
        project: invitation.project,
      };
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException(
        'Failed to add collaborator to project',
        getErrorMessage(error),
      );
    }
  }

  async sendDeniedInvitationEmail(data: {
    email: string;
    project: {
      title: string;
      author: {
        firstname: string;
        lastname: string;
        email: string;
      }
    }
  }) {
    try {

      const mail: MailerOptionInterface = {
        from: process.env.SMTP_FROM as string,
        to: data.project.author.email,
        subject: "Rejet de l'invitation à collaborer sur le projet",
        html: `
          <p>Bonjour ${data.project.author.firstname} ${data.project.author.lastname},</p>
          <p>${data.email} à refusé l'invitation à collaborer sur le projet "${data.project.title}".</p>
          <p>Cordialement,<br/>Team Klippio</p>
        `,
      };

      await this.mailService.sendMail(mail);

    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException(
        'Failed to send denied invitation email',
        getErrorMessage(error),
      );
    }
  }


  /* ----------------- FOLDERS -------------------- */

  async getFolder(folderId: string, projectId: string, userId: number) {
    try {
      const existingProject = await this.findProjectWithAccess(projectId, userId);

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
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException('Failed to get folder');
    }
  }

  async createFolder(
    createFolderDto: CreateFolderDto,
    projectId: string,
    userId: number,
  ) {
    try {
      const { name, parentFolderId } = createFolderDto;
      const existingProject = await this.findProjectWithAccess(projectId, userId);

      if (!existingProject) {
        throw new NotFoundException('Project not found');
      }

      if (parentFolderId) {
        const parentFolder = await this.prismaService.folder.findFirst({
          where: { id: parentFolderId, projectId },
          select: { id: true },
        });

        if (!parentFolder) {
          throw new NotFoundException('Parent folder not found');
        }
      }

      const newFolder = await this.prismaService.folder.create({
        data: {
          name,
          projectId,
          parentId: parentFolderId,
          isRoot: false,
        },
      });

      return newFolder;
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException('Failed to create folder');
    }
  }

  async deleteFolder(folderId: string, projectId: string, userId: number) {
    try {
      await this.assertProjectOwner(projectId, userId);
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
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException('Failed to delete folder');
    }
  }

  async renameFolder(
    folderId: string,
    newName: string,
    projectId: string,
    userId: number,
  ) {
    try {
      await this.assertProjectOwner(projectId, userId);
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
    } catch (error: unknown) {
      rethrowKnownHttpException(error);
      throw new InternalServerErrorException('Failed to rename folder');
    }
  }

  private async assertProjectOwner(projectId: string, userId: number) {
    const project = await this.prismaService.project.findFirst({
      where: { id: projectId, authorId: userId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  private async findProjectWithAccess(projectId: string, userId: number) {
    return this.prismaService.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { authorId: userId },
          { projectCollaborators: { some: { userId } } },
        ],
      },
    });
  }
}
