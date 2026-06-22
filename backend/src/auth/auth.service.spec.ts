import { AuthService } from './auth.service';
import { ok } from 'src/Error/Result';
import type { User } from 'src/user/interfaces/user.interface';

type ForgotPasswordUpdatePayload = Pick<
  User,
  | 'forgotPasswordTokenSelector'
  | 'forgotPasswordToken'
  | 'forgotPasswordTokenExpiry'
>;

describe('AuthService password reset', () => {
  const user = {
    id: 1,
    firstname: 'Ada',
    lastname: 'Lovelace',
    email: 'ada@example.com',
    password: 'hashed-password',
    role: 'STANDARD',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  function createService() {
    const userService = {
      findOneBy: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      getForgotPasswordToken: jest.fn(),
    };

    const mailService = {
      resetPasswordMailOptions: jest.fn(
        (_from: string, _to: string, resetLink: string) => ({ resetLink }),
      ),
      sendMail: jest.fn(),
    };

    return {
      service: new AuthService(userService as never, mailService as never),
      userService,
      mailService,
    };
  }

  beforeEach(() => {
    process.env.FRONTEND_URL = 'http://localhost:3000';
  });

  it('sends the raw reset token and stores only its hash', async () => {
    const { service, userService, mailService } = createService();

    userService.findOneBy.mockResolvedValue(ok(user));
    userService.updateUser.mockResolvedValue(ok(user));
    mailService.sendMail.mockResolvedValue(ok(true));

    const result = await service.forgetPassword(user.email);

    expect(result.ok).toBe(true);

    const updateCalls = userService.updateUser.mock.calls as Array<
      [number, ForgotPasswordUpdatePayload]
    >;
    const resetMailCalls = mailService.resetPasswordMailOptions.mock
      .calls as Array<[string, string, string]>;
    const updatePayload = updateCalls[0][1];
    const resetLink = resetMailCalls[0][2];
    const tokenString = new URL(resetLink).searchParams.get('token');

    expect(tokenString).toHaveLength(96);
    expect(tokenString?.slice(0, 32)).toBe(
      updatePayload.forgotPasswordTokenSelector,
    );
    expect(tokenString?.slice(32)).not.toBe(updatePayload.forgotPasswordToken);
  });

  it('validates a raw reset token against the stored hash', async () => {
    const { service, userService } = createService();
    const { tokenSelector, token, hashedToken } = service.generateToken();

    userService.getForgotPasswordToken.mockResolvedValue(
      ok({
        userId: user.id,
        forgotPasswordTokenSelector: tokenSelector,
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: new Date(Date.now() + 60_000),
      }),
    );
    userService.updateUser.mockResolvedValue(ok(user));

    const result = await service.resetPassword(
      `${tokenSelector}${token}`,
      'new-password',
      'new-password',
    );

    expect(result.ok).toBe(true);
    expect(userService.updateUser).toHaveBeenCalledWith(user.id, {
      password: 'new-password',
      forgotPasswordTokenSelector: null,
      forgotPasswordToken: null,
      forgotPasswordTokenExpiry: null,
    });
  });
});
