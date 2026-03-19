import { Body, Injectable, Req, UseGuards } from "@nestjs/common";
import { create } from "domain";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProjectDTO } from "./dtos/create-project.dto";

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

      return createdProject;
    } catch(error) {
      throw new Error("Failed to create project");
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
        }
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
}