import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

export class InvalidUserInvitationError extends Error {}

type RegistrationData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  invitationToken: string;
  accessKey: string;
};

@Injectable()
export class UserInvitationService {
  private readonly invitationLifetimeMs = 7 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async inviteMany(emails: string[], invitedById: number) {
    const normalizedEmails = [...new Set(emails.map((email) => email.trim().toLowerCase()))];
    const results = await Promise.all(normalizedEmails.map((email) => this.invite(email, invitedById)));
    const sent = results.filter((result) => result.ok).map((result) => result.email);
    const failed = results.filter((result) => !result.ok).map((result) => ({ email: result.email, reason: result.reason }));
    return { sent, failed };
  }

  private async invite(email: string, invitedById: number): Promise<{ ok: true; email: string } | { ok: false; email: string; reason: string }> {
    const existingUser = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingUser) return { ok: false, email, reason: 'Un compte utilise déjà cette adresse.' };

    const existingInvitation = await this.prisma.userInvitation.findFirst({
      where: { email, usedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true },
    });
    if (existingInvitation) return { ok: false, email, reason: 'Une invitation valide existe déjà pour cette adresse.' };

    const token = crypto.randomBytes(32).toString('base64url');
    const accessKey = crypto.randomBytes(18).toString('base64url');
    const invitation = await this.prisma.userInvitation.create({
      data: {
        email,
        token,
        accessKeyHash: this.hash(accessKey),
        expiresAt: new Date(Date.now() + this.invitationLifetimeMs),
        invitedById,
      },
    });

    const registrationLink = `${process.env.FRONTEND_URL}/auth/register?email=${encodeURIComponent(email)}&invitation=${encodeURIComponent(token)}`;
    const mailResult = await this.mailService.sendMail(this.mailService.userInvitationMailOptions({
      to: email,
      registrationLink,
      accessKey,
      expiresAt: invitation.expiresAt,
    }));
    if (!mailResult.ok) {
      await this.prisma.userInvitation.delete({ where: { id: invitation.id } });
      return { ok: false, email, reason: 'L’email n’a pas pu être envoyé.' };
    }
    return { ok: true, email };
  }

  async registerInvitedUser(data: RegistrationData) {
    const email = data.email.trim().toLowerCase();
    const invitation = await this.prisma.userInvitation.findUnique({ where: { token: data.invitationToken } });
    if (!invitation || invitation.email !== email || invitation.usedAt || invitation.expiresAt <= new Date() || !this.matches(data.accessKey, invitation.accessKeyHash)) {
      throw new InvalidUserInvitationError('Cette invitation est invalide, expirée ou a déjà été utilisée.');
    }

    const password = await bcrypt.hash(data.password, 10);
    try {
      return await this.prisma.$transaction(async (tx) => {
        const currentInvitation = await tx.userInvitation.findUnique({ where: { token: data.invitationToken } });
        if (!currentInvitation || currentInvitation.email !== email || currentInvitation.usedAt || currentInvitation.expiresAt <= new Date() || !this.matches(data.accessKey, currentInvitation.accessKeyHash)) {
          throw new InvalidUserInvitationError('Cette invitation est invalide, expirée ou a déjà été utilisée.');
        }
        const user = await tx.user.create({ data: { firstname: data.firstname, lastname: data.lastname, email, password, role: 'STANDARD' } });
        await tx.userInvitation.update({ where: { id: currentInvitation.id }, data: { usedAt: new Date() } });
        return user;
      });
    } catch (error) {
      if (error instanceof InvalidUserInvitationError) throw error;
      throw new InvalidUserInvitationError('Impossible de finaliser cette inscription.');
    }
  }

  private hash(value: string) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  private matches(value: string, storedHash: string) {
    try {
      return crypto.timingSafeEqual(Buffer.from(this.hash(value), 'hex'), Buffer.from(storedHash, 'hex'));
    } catch {
      return false;
    }
  }
}
