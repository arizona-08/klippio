import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';

@Injectable()
export class RealtimeService {
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  emitToProject(projectId: string, event: string, payload: unknown) {
    this.server?.to(this.getProjectRoom(projectId)).emit(event, payload);
  }

  getProjectRoom(projectId: string) {
    return `project:${projectId}`;
  }
}
