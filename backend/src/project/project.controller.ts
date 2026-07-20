import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseEnumPipe,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard, Public } from 'src/auth/authenticated.guard';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { ProjectService } from './project.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RenameDto } from 'src/common/dtos/rename.dto';
import { InviteCollaboratorDto } from './dtos/invite-collaborator.dto';
import { UpdateCollaboratorRoleDto } from './dtos/update-collaborator-role.dto';

enum ProjectSortBy {
  CREATED_AT = 'createdAt',
  LAST_OPENED_AT = 'lastOpenedAt',
  TITLE = 'title',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

@UseGuards(AuthenticatedGuard)
@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async createProject(
    @Body() createProjectDto: CreateProjectDTO,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return this.projectService.createProject(createProjectDto, userId);
  }

  @Get('all')
  async getProjects(
    @CurrentUser() user: User,
    @Query(
      'sortBy',
      new DefaultValuePipe(ProjectSortBy.LAST_OPENED_AT),
      new ParseEnumPipe(ProjectSortBy),
    )
    sortBy: ProjectSortBy,
    @Query(
      'order',
      new DefaultValuePipe(SortOrder.DESC),
      new ParseEnumPipe(SortOrder),
    )
    order: SortOrder,
  ) {
    const userId = user.id;
    return this.projectService.getProjects(userId, sortBy, order);
  }

  @Get('archived')
  async getArchivedProjects(
    @CurrentUser() user: User,
    @Query(
      'sortBy',
      new DefaultValuePipe(ProjectSortBy.LAST_OPENED_AT),
      new ParseEnumPipe(ProjectSortBy),
    )
    sortBy: ProjectSortBy,
    @Query(
      'order',
      new DefaultValuePipe(SortOrder.DESC),
      new ParseEnumPipe(SortOrder),
    )
    order: SortOrder,
  ) {
    const userId = user.id;
    return this.projectService.getProjects(userId, sortBy, order, true);
  }

  @Get(':projectId')
  async getProjectById(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return this.projectService.getProject(userId, projectId);
  }

  @Put(':projectId/update')
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() createProjectDto: CreateProjectDTO,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return this.projectService.updateProject(
      projectId,
      createProjectDto,
      userId,
    );
  }

  @Put(':projectId/archive')
  async archiveProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return this.projectService.archiveProject(projectId, userId);
  }

  @Put(':projectId/unarchive')
  async unarchiveProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return this.projectService.unarchiveProject(projectId, userId);
  }

  @Patch(':projectId/thumbnail')
  @UseInterceptors(FileInterceptor('file')) // 'file' est le nom du champ dans le FormData côté Next.js
  async updateProjectThumbnail(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }), // Limite à 5 Mégaoctets
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }), // Accepte uniquement les images
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return this.projectService.updateProjectThumbnail(userId, projectId, file);
  }

  @Delete(':projectId/delete')
  async deleteProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.deleteProject(projectId, user.id);
  }

  @Post(':projectId/invite')
  async inviteCollaborator(
    @Param('projectId') projectId: string,
    @Body() inviteDto: InviteCollaboratorDto,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return this.projectService.generateInvitationLink(
      projectId,
      userId,
      inviteDto.invitedEmail,
      inviteDto.invitedRole
    );
  }

  @Delete(':projectId/collaborators/:collaboratorId')
  async removeCollaborator(
    @Param('projectId') projectId: string,
    @Param('collaboratorId') collaboratorId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.removeCollaboratorFromProject(
      projectId,
      Number(collaboratorId),
      user.id,
    );
  }

  @Patch(':projectId/collaborators/:collaboratorId/role')
  async updateCollaboratorRole(
    @Param('projectId') projectId: string,
    @Param('collaboratorId') collaboratorId: string,
    @Body() updateCollaboratorRoleDto: UpdateCollaboratorRoleDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.updateCollaboratorRole(
      projectId,
      Number(collaboratorId),
      updateCollaboratorRoleDto.role,
      user.id,
    );
  }

  @Get('invitation/:invitationToken')
  @Public()
  async getInvitationDetails(@Param('invitationToken') invitationToken: string) {
    return this.projectService.getInvitationDetails(invitationToken);
  }

  @Post('invitation/:invitationToken/deny')
  @Public()
  async denyInvitation(@Param('invitationToken') invitationToken: string) {
    return this.projectService.denyInvitation(invitationToken);
  }

  @Post('invitation/:invitationToken/accept')
  async acceptInvitation(
    @Param('invitationToken') invitationToken: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.addCollaboratorToProject(invitationToken, user.id);
  }

  // ------ FOLDERS -------

  @Get(':projectId/folders/root-folder')
  async getProjectRootFolder(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.getProjectRootFolder(projectId, user.id);
  }

  @Get(':projectId/folders/:folderId')
  async getFolder(
    @Param('projectId') projectId: string,
    @Param('folderId') folderId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.getFolder(folderId, projectId, user.id);
  }

  @Post(':projectId/folders/create')
  async createFolder(
    @Param('projectId') projectId: string,
    @Body() createFolderDto: CreateFolderDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.createFolder(
      createFolderDto,
      projectId,
      user.id,
    );
  }

  @Delete(':projectId/folders/:folderId/delete')
  async deleteFolder(
    @Param('projectId') projectId: string,
    @Param('folderId') folderId: string,
    @CurrentUser() user: User,
  ) {
    return this.projectService.deleteFolder(folderId, projectId, user.id);
  }

  @Patch(':projectId/folders/:folderId/rename')
  async renameFolder(
    @Param('projectId') projectId: string,
    @Param('folderId') folderId: string,
    @Body() body: RenameDto,
    @CurrentUser() user: User,
  ) {
    const { newName } = body;
    return this.projectService.renameFolder(
      folderId,
      newName,
      projectId,
      user.id,
    );
  }
}
