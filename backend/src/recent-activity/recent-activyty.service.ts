import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { CreateRecentActivityDto } from "./dtos/create-recent-activity.dto";

@Injectable()
export class RecentActivityService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {}


  async createRecentActivity(body: CreateRecentActivityDto) {
    const { userIds, description } = body;

    try{
      // Vérifier que tous les utilisateurs existent
      for (const userId of userIds) {
        const userExists = await this.userService.findOneBy('id', userId);
        if (!userExists.ok) {
          throw new Error(`User with ID ${userId} does not exist`);
        }
      }

      await Promise.all(userIds.map( async (userId) => {
        await this.prismaService.recentActivity.create({
          data: {
            description,
            userActivities: {
              create: {
                userId,
              }
            }
          },
          include: {
            userActivities: true
          }
        });
      }));

      return { success: true, message: 'Recent activity created successfully' };
    } catch (error: any) {
      console.error('Error creating recent activity:', error);
      throw new InternalServerErrorException(`Failed to create recent activity: ${error.message}`);
    }
  }

  async getRecentActivities(userId: number) {
    try {
      const userActivities = await this.prismaService.usersActivity.findMany({
        where: {
          userId,
        },
        take: 3,
        include: {
          activity: true,
        },
        orderBy: {
          activity: {
            createdAt: 'desc',
          }
        }
      });
      return { success: true, data: userActivities };
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw new InternalServerErrorException('Failed to fetch recent activities');
    }
  }
}