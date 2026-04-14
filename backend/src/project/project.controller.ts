import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
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
}