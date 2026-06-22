import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { InvalidCredentialsError } from 'src/Error/AuthError';
import { User } from 'src/user/interfaces/user.interface';
import { err, ok, Result } from 'src/Error/Result';
import { RegisterDTO } from './dto/register.dto';
import {
  CouldNotCreateUserError,
  CouldNotUpdateUserError,
  PasswordDoNotMatchError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from 'src/Error/UserError';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { MailNotSendedError } from 'src/Error/MailError';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async register(
    registerDto: RegisterDTO,
  ): Promise<
    Result<
      User,
      PasswordDoNotMatchError | UserAlreadyExistsError | CouldNotCreateUserError
    >
  > {
    if (registerDto.password !== registerDto.confirmation) {
      return err(
        new PasswordDoNotMatchError(
          'Le mot de passe et sa confirmation ne correspondent pas.',
        ),
      );
    }

    const existingUser = await this.userService.findOneBy(
      'email',
      registerDto.email,
    );
    if (existingUser.ok) {
      return err(
        new UserAlreadyExistsError(
          'Un utilisateur avec cet email existe déjà.',
        ),
      );
    }

    const newUser = await this.userService.createUser({
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      email: registerDto.email,
      password: registerDto.password,
      role: registerDto.role,
    });
    if (!newUser.ok) {
      return err(
        new CouldNotCreateUserError(
          `Impossible de créer l'utilisateur: ${newUser.error.message}`,
        ),
      );
    }

    return ok(newUser.value);
  }

  async login(
    email: string,
    userPassword: string,
  ): Promise<Result<Partial<User>, InvalidCredentialsError>> {
    const user = await this.userService.findOneBy('email', email);
    if (!user.ok) {
      return err(new InvalidCredentialsError('Identifiants invalides'));
    }

    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.value.password,
    );
    if (!isPasswordValid) {
      return err(new InvalidCredentialsError('Identifiants invalides'));
    }

    return ok(this.removePassword(user.value));
  }

  async forgetPassword(
    email: string,
  ): Promise<
    Result<
      string,
      UserNotFoundError | CouldNotUpdateUserError | MailNotSendedError
    >
  > {
    const user = await this.userService.findOneBy('email', email);
    if (!user.ok) {
      return err(
        new UserNotFoundError('Aucun utilisateur trouvé avec cet email.'),
      );
    }

    const { tokenSelector, token, hashedToken } = this.generateToken();
    const expiry = new Date(Date.now() + 3600000); // 1 heure

    const updatedUser = await this.userService.updateUser(user.value.id, {
      forgotPasswordTokenSelector: tokenSelector,
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: expiry,
    });

    if (!updatedUser.ok) {
      return err(new CouldNotUpdateUserError(updatedUser.error.message));
    }

    const tokenString = tokenSelector + token;
    const frontendURL = process.env.FRONTEND_URL;
    const resetLink = `${frontendURL}/auth/reset-password?token=${tokenString}`;
    const resetMail = this.mailService.resetPasswordMailOptions(
      'team@klippio.com',
      email,
      resetLink,
    );
    const mail = await this.mailService.sendMail(resetMail);

    if (!mail.ok) {
      return err(mail.error);
    }

    return ok(resetLink);
  }

  async resetPassword(
    tokenString: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<
    Result<Partial<User>, CouldNotUpdateUserError | PasswordDoNotMatchError>
  > {
    if (!tokenString || tokenString.length !== 96) {
      return err(
        new CouldNotUpdateUserError(
          `Token de réinitialisation invalide. Veuillez générer un nouveau token.`,
        ),
      );
    }

    const tokenSelector = tokenString.slice(0, 32);
    const token = tokenString.slice(32);
    const hashedToken = this.hashResetToken(token);
    const storedPasswordToken =
      await this.userService.getForgotPasswordToken(tokenSelector);
    if (!storedPasswordToken.ok) {
      return err(new UserNotFoundError(`Token de réinitialisation invalide.`));
    }

    if (!storedPasswordToken.value) {
      return err(
        new CouldNotUpdateUserError(
          'Aucun token de réinitialisation trouvé. Veuillez générer un nouveau token.',
        ),
      );
    }

    if (
      !storedPasswordToken.value.forgotPasswordTokenExpiry ||
      storedPasswordToken.value.forgotPasswordTokenExpiry < new Date()
    ) {
      return err(
        new CouldNotUpdateUserError(
          'Token de réinitialisation expiré. Veuillez générer un nouveau token.',
        ),
      );
    }

    if (
      !this.areTokensEqual(
        hashedToken,
        storedPasswordToken.value.forgotPasswordToken,
      )
    ) {
      return err(
        new CouldNotUpdateUserError(
          `Token de réinitialisation invalide. Veuillez générer un nouveau token.`,
        ),
      );
    }

    if (newPassword !== confirmNewPassword) {
      return err(
        new PasswordDoNotMatchError(
          'Le mot de passe et sa confirmation ne correspondent pas.',
        ),
      );
    }

    const updatedUser = await this.userService.updateUser(
      storedPasswordToken.value.userId,
      {
        password: newPassword,
        forgotPasswordTokenSelector: null,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: null,
      },
    );

    if (!updatedUser.ok) {
      return err(new CouldNotUpdateUserError(updatedUser.error.message));
    }

    return ok(this.removePassword(updatedUser.value));
  }

  generateToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenSelector = crypto.randomBytes(16).toString('hex');
    const hashedToken = this.hashResetToken(token);
    return { tokenSelector, token, hashedToken };
  }

  private hashResetToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private areTokensEqual(
    candidateTokenHash: string,
    storedTokenHash: string | null | undefined,
  ) {
    if (!storedTokenHash) return false;

    try {
      return crypto.timingSafeEqual(
        Buffer.from(candidateTokenHash, 'hex'),
        Buffer.from(storedTokenHash, 'hex'),
      );
    } catch {
      return false;
    }
  }

  private removePassword(user: User): UserWithoutPassword {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      forgotPasswordTokenSelector: user.forgotPasswordTokenSelector,
      forgotPasswordToken: user.forgotPasswordToken,
      forgotPasswordTokenExpiry: user.forgotPasswordTokenExpiry,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profilePicture: user.profilePicture,
      bannerPicture: user.bannerPicture,
    };
  }
}
