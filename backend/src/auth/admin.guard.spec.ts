import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

function createExecutionContext(request: unknown): ExecutionContext {
  return {
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => request),
    })),
  } as unknown as ExecutionContext;
}

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  it('allows admin users', () => {
    expect(
      guard.canActivate(createExecutionContext({ user: { role: 'ADMIN' } })),
    ).toBe(true);
  });

  it('allows superadmin users', () => {
    expect(
      guard.canActivate(createExecutionContext({ user: { role: 'SUPERADMIN' } })),
    ).toBe(true);
  });

  it('rejects non-admin users', () => {
    expect(() =>
      guard.canActivate(createExecutionContext({ user: { role: 'STANDARD' } })),
    ).toThrow(ForbiddenException);
  });

  it('rejects unauthenticated requests', () => {
    expect(() => guard.canActivate(createExecutionContext({}))).toThrow(
      ForbiddenException,
    );
  });
});
