import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RealtimeService } from 'src/realtime/realtime.service';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService, private readonly realtime: RealtimeService) {}

  createTicket(authorId: number, subject: string, content: string) {
    return this.prisma.supportTicket.create({
      data: {
        subject: subject.trim(),
        authorId,
        messages: { create: { content: content.trim(), authorId } },
      },
      include: {
        messages: {
          include: {
            author: { select: { id: true, firstname: true, lastname: true } },
          },
        },
      },
    });
  }

  findMyTickets(authorId: number) {
    return this.prisma.supportTicket.findMany({
      where: { authorId },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    });
  }

  findAllTickets() {
    return this.prisma.supportTicket.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
        _count: { select: { messages: true } },
      },
    });
  }

  async findTicket(id: string, userId: number, isAdmin: boolean) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id, ...(isAdmin ? {} : { authorId: userId }) },
      include: {
        author: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, firstname: true, lastname: true, role: true },
            },
          },
        },
      },
    });
    if (!ticket)
      throw new NotFoundException('Demande d’assistance introuvable.');
    return ticket;
  }

  async addMessage(
    ticketId: string,
    userId: number,
    isAdmin: boolean,
    content: string,
  ) {
    await this.findTicket(ticketId, userId, isAdmin);
    const message = await this.prisma.supportMessage.create({
      data: { ticketId, authorId: userId, content: content.trim() },
      include: {
        author: {
          select: { id: true, firstname: true, lastname: true, role: true },
        },
      },
    });
    if (!isAdmin)
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'OPEN' },
      });
    this.realtime.emitToSupportTicket(ticketId, 'support-ticket:message', { ticketId, message });
    return message;
  }

  async updateStatus(ticketId: string, status: 'OPEN' | 'RESOLVED' | 'CLOSED') {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket)
      throw new NotFoundException('Demande d’assistance introuvable.');

    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });
  }
}
