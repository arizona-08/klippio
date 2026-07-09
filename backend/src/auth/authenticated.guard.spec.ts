import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { err, ok } from 'src/Error/Result';
import { UserNotFoundError } from 'src/Error/UserError';
import { AuthenticatedGuard } from './authenticated.guard';
import type { User } from 'src/user/interfaces/user.interface';

const user: User = {
  id: 1,
  firstname: 'Ada',
  lastname: 'Lovelace',
  email: 'ada@example.com',
  password: 'hashed-password',
  role: 'STANDARD',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createExecutionContext(request: unknown): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => request),
    })),
  } as unknown as ExecutionContext;
}

describe('AuthenticatedGuard', () => {
  function createGuard(isPublic = false) {
    const userService = {
      findOneBy: jest.fn(),
    };
    const reflector = {
      getAllAndOverride: jest.fn(() => isPublic),
    } as unknown as Reflector;

    return {
      guard: new AuthenticatedGuard(userService as never, reflector),
      userService,
    };
  }

  it('allows public routes without reading the session', async () => {
    const { guard, userService } = createGuard(true);
    const request = { session: {} };

    await expect(
      guard.canActivate(createExecutionContext(request)),
    ).resolves.toBe(true);
    expect(userService.findOneBy).not.toHaveBeenCalled();
  });

  it('attaches the authenticated user to the request', async () => {
    const { guard, userService } = createGuard();
    const request = { session: { userId: user.id }, user: undefined };
    userService.findOneBy.mockResolvedValue(ok(user));

    await expect(
      guard.canActivate(createExecutionContext(request)),
    ).resolves.toBe(true);

    expect(userService.findOneBy).toHaveBeenCalledWith('id', user.id);
    expect(request.user).toBe(user);
  });

  it('rejects requests without a user in session', async () => {
    const { guard } = createGuard();

    await expect(
      guard.canActivate(createExecutionContext({ session: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects requests when the session user no longer exists', async () => {
    const { guard, userService } = createGuard();
    userService.findOneBy.mockResolvedValue(
      err(new UserNotFoundError('User not found')),
    );

    await expect(
      guard.canActivate(createExecutionContext({ session: { userId: 1 } })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
