import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  function createService() {
    const prismaService = {
      project: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      projectCollaborator: {
        create: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      projectInvitation: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      folder: {
        create: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };
    const amazonS3Service = {
      generatePresignedUrl: jest.fn(),
    };
    const mailService = {
      sendMail: jest.fn(),
    };

    return {
      service: new ProjectService(
        prismaService as never,
        amazonS3Service as never,
        mailService as never,
      ),
      prismaService,
      amazonS3Service,
      mailService,
    };
  }

  it('creates the project, owner collaborator and root folder', async () => {
    const { service, prismaService } = createService();
    const createdProject = { id: 'project-1', title: 'My project' };
    prismaService.project.create.mockResolvedValue(createdProject);

    await expect(
      service.createProject(
        {
          title: 'My project',
          address: '1 rue du Test',
          city: 'Paris',
          zipcode: '75001',
        },
        12,
      ),
    ).resolves.toBe(createdProject);

    expect(prismaService.projectCollaborator.create).toHaveBeenCalledWith({
      data: {
        projectId: createdProject.id,
        userId: 12,
        role: 'OWNER',
      },
    });
    expect(prismaService.folder.create).toHaveBeenCalledWith({
      data: {
        name: 'root',
        isRoot: true,
        projectId: createdProject.id,
      },
    });
  });

  it('formats project list with counts, thumbnail url and owner-only invitations', async () => {
    const { service, prismaService, amazonS3Service } = createService();
    const updatedAt = new Date();
    prismaService.project.findMany.mockResolvedValue([
      {
        id: 'project-1',
        authorId: 12,
        author: {
          id: 12,
          firstname: 'Ada',
          lastname: 'Lovelace',
          email: 'ada@example.com',
        },
        title: 'Project with photos',
        address: '1 rue du Test',
        zipcode: '75001',
        city: 'Paris',
        updatedAt,
        isArchived: false,
        thumbnailStorageKey: 'thumbnail-key',
        projectCollaborators: [{ role: 'OWNER', user: { id: 12 } }],
        projectInvitations: [
          { email: 'pending@example.com', role: 'VIEWER', status: 'PENDING' },
          { email: 'done@example.com', role: 'VIEWER', status: 'ACCEPTED' },
        ],
        _count: { plans: 2 },
        plans: [
          {
            markers: [
              { _count: { markerPhotos: 2 } },
              { _count: { markerPhotos: 3 } },
            ],
          },
        ],
      },
    ]);
    amazonS3Service.generatePresignedUrl.mockResolvedValue(
      'https://cdn.example/thumbnail',
    );

    const projects = await service.getProjects(12, 'createdAt', 'desc');

    expect(prismaService.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { authorId: 12 },
            { projectCollaborators: { some: { userId: 12 } } },
          ],
          isArchived: false,
        }),
        orderBy: { createdAt: 'desc' },
      }),
    );
    expect(projects).toEqual([
      expect.objectContaining({
        id: 'project-1',
        numberOfPlans: 2,
        numberOfPhotos: 5,
        thumbnailTemporaryAccessUrl: 'https://cdn.example/thumbnail',
        invitations: [
          { email: 'pending@example.com', role: 'VIEWER', status: 'PENDING' },
        ],
      }),
    ]);
  });

  it('rejects project updates from users who are not the author', async () => {
    const { service, prismaService } = createService();
    prismaService.project.findUnique.mockResolvedValue({
      id: 'project-1',
      authorId: 12,
    });

    await expect(
      service.updateProject(
        'project-1',
        {
          title: 'Updated title',
          address: '1 rue du Test',
          city: 'Paris',
          zipcode: '75001',
        },
        99,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prismaService.project.update).not.toHaveBeenCalled();
  });

  it('returns viewer permissions for a collaborator with read-only access', async () => {
    const { service, prismaService } = createService();
    prismaService.project.findFirst.mockResolvedValue({
      authorId: 12,
      projectCollaborators: [{ role: 'VIEWER' }],
    });

    await expect(service.getProjectPermissions('project-1', 99)).resolves.toEqual({
      role: 'VIEWER',
      canView: true,
      canEdit: false,
    });
  });

  it('removes a collaborator when requested by the project owner', async () => {
    const { service, prismaService } = createService();
    prismaService.project.findUnique.mockResolvedValue({
      id: 'project-1',
      authorId: 12,
    });
    prismaService.projectCollaborator.findFirst.mockResolvedValue({
      id: 'collaborator-1',
      userId: 99,
      role: 'EDITOR',
    });

    await expect(
      service.removeCollaboratorFromProject('project-1', 99, 12),
    ).resolves.toEqual({ success: true });

    expect(prismaService.projectCollaborator.delete).toHaveBeenCalledWith({
      where: { id: 'collaborator-1' },
    });
  });

  it('does not allow a non-owner to remove a collaborator', async () => {
    const { service, prismaService } = createService();
    prismaService.project.findUnique.mockResolvedValue({
      id: 'project-1',
      authorId: 12,
    });

    await expect(
      service.removeCollaboratorFromProject('project-1', 99, 33),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prismaService.projectCollaborator.delete).not.toHaveBeenCalled();
  });

  it('does not allow the project owner to be removed', async () => {
    const { service, prismaService } = createService();
    prismaService.project.findUnique.mockResolvedValue({
      id: 'project-1',
      authorId: 12,
    });

    await expect(
      service.removeCollaboratorFromProject('project-1', 12, 12),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates a collaborator role when requested by the project owner', async () => {
    const { service, prismaService } = createService();
    prismaService.project.findUnique.mockResolvedValue({
      id: 'project-1',
      authorId: 12,
    });
    prismaService.projectCollaborator.findFirst.mockResolvedValue({
      id: 'collaborator-1',
      userId: 99,
      role: 'VIEWER',
    });
    prismaService.projectCollaborator.update.mockResolvedValue({
      id: 'collaborator-1',
      userId: 99,
      role: 'EDITOR',
    });

    await expect(
      service.updateCollaboratorRole('project-1', 99, 'EDITOR', 12),
    ).resolves.toEqual({
      success: true,
      collaborator: {
        id: 'collaborator-1',
        userId: 99,
        role: 'EDITOR',
      },
    });

    expect(prismaService.projectCollaborator.update).toHaveBeenCalledWith({
      where: { id: 'collaborator-1' },
      data: { role: 'EDITOR' },
    });
  });

  it('adds a collaborator from a valid invitation', async () => {
    const { service, prismaService } = createService();
    const expiresAt = new Date(Date.now() + 60_000);
    prismaService.projectInvitation.findUnique.mockResolvedValue({
      token: 'token-1',
      projectId: 'project-1',
      email: 'ada@example.com',
      role: 'EDITOR',
      status: 'PENDING',
      expiresAt,
      project: { id: 'project-1', title: 'Shared project' },
    });
    prismaService.user.findUnique.mockResolvedValue({
      id: 12,
      email: 'ada@example.com',
    });
    prismaService.projectCollaborator.findFirst.mockResolvedValue(null);

    await expect(
      service.addCollaboratorToProject('token-1', 12),
    ).resolves.toEqual({
      success: true,
      projectId: 'project-1',
      project: { id: 'project-1', title: 'Shared project' },
    });

    expect(prismaService.projectCollaborator.create).toHaveBeenCalledWith({
      data: {
        projectId: 'project-1',
        userId: 12,
        role: 'EDITOR',
      },
    });
    expect(prismaService.projectInvitation.update).toHaveBeenCalledWith({
      where: { token: 'token-1' },
      data: { status: 'ACCEPTED' },
    });
  });

  it('rejects invitations used by a different email address', async () => {
    const { service, prismaService } = createService();
    prismaService.projectInvitation.findUnique.mockResolvedValue({
      projectId: 'project-1',
      email: 'invited@example.com',
      role: 'VIEWER',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 60_000),
      project: { id: 'project-1', title: 'Shared project' },
    });
    prismaService.user.findUnique.mockResolvedValue({
      id: 12,
      email: 'other@example.com',
    });

    await expect(
      service.addCollaboratorToProject('token-1', 12),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prismaService.projectCollaborator.create).not.toHaveBeenCalled();
  });

  it('rejects missing invitations', async () => {
    const { service, prismaService } = createService();
    prismaService.projectInvitation.findUnique.mockResolvedValue(null);

    await expect(
      service.addCollaboratorToProject('missing-token', 12),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
