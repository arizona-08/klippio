import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { CreateProjectDTO } from "./dtos/create-project.dto";
import { ProjectService } from "./project.service";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import type { User } from "src/user/interfaces/user.interface";
import { CreateFolderDto } from "./dtos/create-folder.dto";

@UseGuards(AuthenticatedGuard)
@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService){}

  
  @Post('create')
  async createProject(@Body() createProjectDto: CreateProjectDTO, @CurrentUser() user: User){
    const userId = user.id;
    return this.projectService.createProject(createProjectDto, userId);
  }

  
  @Get('all')
  async getProjects(
    @CurrentUser() user: User,
    @Query('sortBy') sortBy: "createdAt" | "lastOpenedAt" | "title",
    @Query('order') order: 'asc' | 'desc'
  ) {
    const userId = user.id;
    return this.projectService.getProjects(userId, sortBy, order);
  }

  
  @Get('archived')
  async getArchivedProjects(
    @CurrentUser() user: User,
    @Query('sortBy') sortBy: "createdAt" | "lastOpenedAt" | "title",
    @Query('order') order: 'asc' | 'desc'
  ) {
    const userId = user.id;
    return this.projectService.getProjects(userId, sortBy, order, true);
  }

  @Get(":projectId")
  async getProjectById(@Param('projectId') projectId: string, @CurrentUser() user: User) {
    const userId = user.id;
    return this.projectService.getProject(userId, projectId)
  }

  
  @Put(':projectId/update')
  async updateProject(@Param('projectId') projectId: string, @Body() createProjectDto: CreateProjectDTO, @CurrentUser() user: User){
    const userId = user.id;
    return this.projectService.updateProject(projectId, createProjectDto, userId);
  }

  @Put(':projectId/archive')
  async archiveProject(@Param('projectId') projectId: string, @CurrentUser() user: User){
    const userId = user.id;
    return this.projectService.archiveProject(projectId, userId);
  }

  @Put(':projectId/unarchive')
  async unarchiveProject(@Param('projectId') projectId: string, @CurrentUser() user: User){
    const userId = user.id;
    return this.projectService.unarchiveProject(projectId, userId);
  }

  @Delete(':projectId/delete')
  async deleteProject(@Param('projectId') projectId: string, @CurrentUser() user: User){
    return this.projectService.deleteProject(projectId, user.id)
  }

    // ------ FOLDERS -------

  @Get(':projectId/folders/root-folder')
  async getProjectRootFolder(@Param('projectId') projectId: string) {
    return this.projectService.getProjectRootFolder(projectId);
  }

  @Get(':projectId/folders/:folderId')
  async getFolder(@Param('projectId') projectId: string, @Param('folderId') folderId: string) {
    return this.projectService.getFolder(folderId, projectId);
  }

  @Post(':projectId/folders/create')
  async createFolder(@Param('projectId') projectId: string, @Body() createFolderDto: CreateFolderDto) {
    return this.projectService.createFolder(createFolderDto, projectId);
  }

  @Delete(':projectId/folders/:folderId/delete')
  async deleteFolder(@Param('projectId') projectId: string, @Param('folderId') folderId: string) {
    return this.projectService.deleteFolder(folderId, projectId);
  }

  @Patch(':projectId/folders/:folderId/rename')
  async renameFolder(@Param('projectId') projectId: string, @Param('folderId') folderId: string, @Body() body: { newName: string }) {
    const { newName } = body;
    return this.projectService.renameFolder(folderId, newName, projectId);
  }
}