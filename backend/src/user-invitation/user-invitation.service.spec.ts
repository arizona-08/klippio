import * as crypto from 'crypto';
import { ok } from 'src/Error/Result';
import { UserInvitationService } from './user-invitation.service';

describe('UserInvitationService', () => {
  function createService() {
    const prisma = {
      user: { findUnique: jest.fn() },
      userInvitation: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), update: jest.fn() },
      $transaction: jest.fn(),
    };
    const mailService = { userInvitationMailOptions: jest.fn((data) => data), sendMail: jest.fn() };
    return { service: new UserInvitationService(prisma as never, mailService as never), prisma, mailService };
  }

  it('creates one distinct access key and email per invited address', async () => {
    const { service, prisma, mailService } = createService();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.userInvitation.findFirst.mockResolvedValue(null);
    prisma.userInvitation.create.mockImplementation(({ data }) => Promise.resolve({ id: data.token, expiresAt: data.expiresAt }));
    mailService.sendMail.mockResolvedValue(ok(true));

    const result = await service.inviteMany(['one@example.com', 'two@example.com'], 7);

    expect(result).toEqual({ sent: ['one@example.com', 'two@example.com'], failed: [] });
    expect(mailService.userInvitationMailOptions.mock.calls[0][0].accessKey).not.toBe(mailService.userInvitationMailOptions.mock.calls[1][0].accessKey);
    expect(prisma.userInvitation.create).toHaveBeenCalledTimes(2);
  });

  it('creates the account and consumes the invitation in one transaction', async () => {
    const { service, prisma } = createService();
    const accessKey = 'personal-access-key';
    const invitation = { id: 'invitation-1', token: 'token', email: 'invitee@example.com', accessKeyHash: crypto.createHash('sha256').update(accessKey).digest('hex'), usedAt: null, expiresAt: new Date(Date.now() + 60_000) };
    prisma.userInvitation.findUnique.mockResolvedValue(invitation);
    prisma.$transaction.mockImplementation((callback) => callback({ userInvitation: { findUnique: jest.fn().mockResolvedValue(invitation), update: prisma.userInvitation.update }, user: { create: jest.fn().mockResolvedValue({ id: 3, email: invitation.email }) } }));

    await service.registerInvitedUser({ firstname: 'Ada', lastname: 'Lovelace', email: invitation.email, password: 'a-secure-password', invitationToken: invitation.token, accessKey });

    expect(prisma.userInvitation.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: invitation.id } }));
  });
});
