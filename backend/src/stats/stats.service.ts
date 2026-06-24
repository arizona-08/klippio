import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getUserStats(userId: number) {
    try {
      const existingUser = await this.userService.findOneBy('id', userId);

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const markerStats = await this.getMarkerStats(userId);
      const photosStats = await this.getPhotosStats(userId);
      const projectsStats = await this.getProjectsStats(userId);
      const plansStats = await this.getPlansStats(userId);

      return {
        markerStats,
        photosStats,
        projectsStats,
        plansStats,
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new InternalServerErrorException('Failed to fetch user stats');
    }
  }

  async getMarkerStats(userId: number) {
    const totalMarkers = await this.prismaService.marker.count({
      where: {
        plan: {
          project: {
            authorId: userId,
          },
        },
      },
    });

    const markersLastWeek = await this.prismaService.marker.count({
      where: {
        plan: {
          project: {
            authorId: userId,
          },
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Marqueurs créés dans les 7 derniers jours
        },
      },
    });

    return { totalMarkers, markersLastWeek };
  }

  async getPhotosStats(userId: number) {
    const totalPhotos = await this.prismaService.markerPhoto.count({
      where: {
        marker: {
          plan: {
            project: {
              authorId: userId,
            },
          },
        },
      },
    });

    const photosLastWeek = await this.prismaService.markerPhoto.count({
      where: {
        marker: {
          plan: {
            project: {
              authorId: userId,
            },
          },
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Photos créées dans les 7 derniers jours
        },
      },
    });

    return { totalPhotos, photosLastWeek };
  }
  async getProjectsStats(userId: number) {
    const totalProjects = await this.prismaService.project.count({
      where: {
        authorId: userId,
      },
    });

    const projectsLastWeek = await this.prismaService.project.count({
      where: {
        authorId: userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Projets créés dans les 7 derniers jours
        },
      },
    });

    return { totalProjects, projectsLastWeek };
  }

  async getPlansStats(userId: number) {
    const totalPlans = await this.prismaService.plan.count({
      where: {
        project: {
          authorId: userId,
        },
      },
    });

    const plansLastWeek = await this.prismaService.plan.count({
      where: {
        project: {
          authorId: userId,
        },
        lastOpenedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Plans créés dans les 7 derniers jours
        },
      },
    });

    return { totalPlans, plansLastWeek };
  }

  async getThreeLastOpenedPlans(userId: number) {
    const lastOpenedPlans = await this.prismaService.plan.findMany({
      where: { project: { authorId: userId } },
      orderBy: { lastOpenedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        name: true,
        lastOpenedAt: true,

        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return lastOpenedPlans;
  }
}
