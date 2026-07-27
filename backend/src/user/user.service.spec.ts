import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';

describe('UserService', () => {
  function createService() {
    const prisma = {
      user: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    const amazonS3Service = {
      generatePresignedUrl: jest.fn(),
    };

    return {
      service: new UserService(prisma as never, amazonS3Service as never),
      prisma,
      amazonS3Service,
    };
  }

  it('hashes the password before creating a user', async () => {
    const { service, prisma } = createService();
    prisma.user.create.mockImplementation(({ data }) =>
      Promise.resolve({ id: 1, ...data }),
    );

    const result = await service.createUser({
      firstname: 'Ada',
      lastname: 'Lovelace',
      email: 'ada@example.com',
      password: 'plain-password',
      role: 'STANDARD',
    });

    expect(result.ok).toBe(true);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        password: expect.not.stringMatching(/^plain-password$/),
      }),
    });

    const hashedPassword = prisma.user.create.mock.calls[0][0].data.password;
    await expect(
      bcrypt.compare('plain-password', hashedPassword),
    ).resolves.toBe(true);
  });

  it('returns a user with presigned profile and banner pictures', async () => {
    const { service, prisma, amazonS3Service } = createService();
    prisma.user.findFirst.mockResolvedValue({
      id: 1,
      firstname: 'Ada',
      lastname: 'Lovelace',
      email: 'ada@example.com',
      password: 'hashed-password',
      role: 'STANDARD',
      createdAt: new Date(),
      updatedAt: new Date(),
      userPictures: [
        {
          storageKey: 'profile-key',
          zoom: 1,
          offsetX: 2,
          offsetY: 3,
          type: 'PROFILE',
        },
        {
          storageKey: 'banner-key',
          zoom: 4,
          offsetX: 5,
          offsetY: 6,
          type: 'BANNER',
        },
      ],
    });
    amazonS3Service.generatePresignedUrl
      .mockResolvedValueOnce('https://cdn.example/profile')
      .mockResolvedValueOnce('https://cdn.example/banner');

    const result = await service.findOneBy('email', 'ada@example.com');

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.profilePicture).toEqual({
      url: 'https://cdn.example/profile',
      zoom: 1,
      offsetX: 2,
      offsetY: 3,
      type: 'PROFILE',
    });
    expect(result.value.bannerPicture).toEqual({
      url: 'https://cdn.example/banner',
      zoom: 4,
      offsetX: 5,
      offsetY: 6,
      type: 'BANNER',
    });
  });

  it('prevents updating an email to one already used by another user', async () => {
    const { service, prisma } = createService();
    prisma.user.findFirst
      .mockResolvedValueOnce({
        id: 1,
        firstname: 'Ada',
        lastname: 'Lovelace',
        email: 'ada@example.com',
        password: 'hashed-password',
        role: 'STANDARD',
        createdAt: new Date(),
        updatedAt: new Date(),
        userPictures: [],
      })
      .mockResolvedValueOnce({ id: 2, email: 'taken@example.com' });

    const result = await service.updateUser(1, {
      email: 'taken@example.com',
    });

    expect(result.ok).toBe(false);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
