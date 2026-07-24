import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getNotifications(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [notifications, invitations] = await Promise.all([
      this.prismaService.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.projectInvitation.findMany({
        where: { email: user.email, status: 'PENDING', expiresAt: { gt: new Date() } },
        select: {
          id: true,
          token: true,
          role: true,
          createdAt: true,
          project: { select: { id: true, title: true, author: { select: { firstname: true, lastname: true } } } },
        },
      }),
    ]);

    const invitationNotifications = invitations.map((invitation) => ({
      id: `invitation-${invitation.id}`,
      type: 'INVITATION' as const,
      title: 'Nouvelle invitation',
      message: `${invitation.project.author.firstname} ${invitation.project.author.lastname} vous invite à rejoindre « ${invitation.project.title} » en tant que ${invitation.role === 'EDITOR' ? 'éditeur' : 'lecteur'}.`,
      projectId: invitation.project.id,
      invitationToken: invitation.token,
      createdAt: invitation.createdAt,
      isRead: false,
    }));

    const allNotifications = [...notifications, ...invitationNotifications].sort(
      (first, second) => second.createdAt.getTime() - first.createdAt.getTime(),
    );

    return { notifications: allNotifications, unreadCount: allNotifications.filter((item) => !item.isRead).length };
  }
}
