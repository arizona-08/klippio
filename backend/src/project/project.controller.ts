import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { CreateProjectDTO } from "./dtos/create-project.dto";
import { ProjectService } from "./project.service";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import type { User } from "src/user/interfaces/user.interface";
import { CreateFolderDto } from "./dtos/create-folder.dto";

@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService){}

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  async createProject(@Body() createProjectDto: CreateProjectDTO, @CurrentUser() user: User){
    const userId = user.id;
    return this.projectService.createProject(createProjectDto, userId);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  async getProjects(@CurrentUser() user: User){
    const userId = user.id;
    return this.projectService.getProjects(userId);
  }

    // ------ FOLDERS -------

  @Get(':projectId/folders/root-folder')
  async getProjectRootFolder(@Param('projectId') projectId: string) {
    return this.projectService.getProjectRootFolder(projectId);
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