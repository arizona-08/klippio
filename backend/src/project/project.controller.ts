import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { CreateProjectDTO } from "./dtos/create-project.dto";
import { ProjectService } from "./project.service";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import type { User } from "src/user/interfaces/user.interface";

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
}