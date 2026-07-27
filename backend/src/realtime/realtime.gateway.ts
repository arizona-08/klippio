import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { RequestHandler } from 'express';
import type { Server, Socket } from 'socket.io';
import { createSessionMiddleware, getAllowedOrigins } from 'src/session/session.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RealtimeService } from './realtime.service';

type SessionSocket = Socket & {
  request: Socket['request'] & {
    session?: {
      userId?: number;
    };
  };
  data: {
    userId?: number;
    user?: {
      id: number;
      firstname: string;
      lastname: string;
      email: string;
    };
    joinedProjects?: Set<string>;
  };
};

type JoinProjectPayload = {
  projectId?: string;
};

type CursorMovePayload = {
  projectId?: string;
  planId?: string;
  pageNumber?: number;
  x?: number;
  y?: number;
};

@WebSocketGateway({
  cors: {
    origin: getAllowedOrigins(),
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server!: Server;

  private readonly sessionMiddleware: RequestHandler;
  private readonly projectPresence = new Map<string, Map<string, SessionSocket>>();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly realtimeService: RealtimeService,
  ) {
    this.sessionMiddleware = createSessionMiddleware();
  }

  afterInit(server: Server) {
    server.engine.use(this.sessionMiddleware);
    this.realtimeService.setServer(server);
  }

  async handleConnection(client: SessionSocket) {
    const userId = client.request.session?.userId;

    if (!userId) {
      client.disconnect(true);
      return;
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
      },
    });

    if (!user) {
      client.disconnect(true);
      return;
    }

    client.data.userId = userId;
    client.data.user = user;
    client.data.joinedProjects = new Set();
    await client.join(this.realtimeService.getUserRoom(userId));
  }

  handleDisconnect(client: SessionSocket) {
    client.data.joinedProjects?.forEach((projectId) => {
      this.removeClientFromPresence(client, projectId);
    });
  }

  @SubscribeMessage('project:join')
  async joinProject(
    @ConnectedSocket() client: SessionSocket,
    @MessageBody() payload: JoinProjectPayload,
  ) {
    const userId = client.data.userId;
    const projectId = payload.projectId;

    if (!userId || !projectId) return;

    const hasAccess = await this.hasProjectAccess(projectId, userId);
    if (!hasAccess) return;

    await client.join(this.realtimeService.getProjectRoom(projectId));
    client.data.joinedProjects?.add(projectId);
    this.addClientToPresence(client, projectId);
  }

  @SubscribeMessage('project:leave')
  async leaveProject(
    @ConnectedSocket() client: SessionSocket,
    @MessageBody() payload: JoinProjectPayload,
  ) {
    if (!payload.projectId) return;

    await client.leave(this.realtimeService.getProjectRoom(payload.projectId));
    client.data.joinedProjects?.delete(payload.projectId);
    this.removeClientFromPresence(client, payload.projectId);
  }

  @SubscribeMessage('cursor:move')
  handleCursorMove(
    @ConnectedSocket() client: SessionSocket,
    @MessageBody() payload: CursorMovePayload,
  ) {
    const { projectId, planId, pageNumber, x, y } = payload;

    if (
      !projectId ||
      !planId ||
      typeof pageNumber !== 'number' ||
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      !client.data.joinedProjects?.has(projectId)
    ) {
      return;
    }

    client.to(this.realtimeService.getProjectRoom(projectId)).emit('cursor:move', {
      projectId,
      planId,
      pageNumber,
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
      user: client.data.user,
      socketId: client.id,
      updatedAt: new Date().toISOString(),
    });
  }

  private async hasProjectAccess(projectId: string, userId: number) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { authorId: userId },
          { projectCollaborators: { some: { userId } } },
        ],
      },
      select: { id: true },
    });

    return Boolean(project);
  }

  private addClientToPresence(client: SessionSocket, projectId: string) {
    const projectClients =
      this.projectPresence.get(projectId) ?? new Map<string, SessionSocket>();
    projectClients.set(client.id, client);
    this.projectPresence.set(projectId, projectClients);
    this.broadcastPresence(projectId);
  }

  private removeClientFromPresence(client: SessionSocket, projectId: string) {
    const projectClients = this.projectPresence.get(projectId);
    if (!projectClients) return;

    projectClients.delete(client.id);

    if (projectClients.size === 0) {
      this.projectPresence.delete(projectId);
    } else {
      this.broadcastPresence(projectId);
    }
  }

  private broadcastPresence(projectId: string) {
    const projectClients = this.projectPresence.get(projectId);
    const collaborators = Array.from(projectClients?.values() ?? []).map(
      (client) => ({
        socketId: client.id,
        user: client.data.user,
      }),
    );

    this.server
      .to(this.realtimeService.getProjectRoom(projectId))
      .emit('project:presence', { projectId, collaborators });
  }
}
