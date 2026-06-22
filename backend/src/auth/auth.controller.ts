import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Query,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { RegisterDTO } from './dto/register.dto';
import {
  CouldNotCreateUserError,
  PasswordDoNotMatchError,
} from 'src/Error/UserError';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';

import { MailNotSendedError } from 'src/Error/MailError';
import type { User } from 'src/user/interfaces/user.interface';

type AuthSession = {
  userId?: number;
  role?: User['role'];
  destroy: (callback?: (err?: Error) => void) => void;
};

type UserWithoutPassword = Omit<User, 'password'>;

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDTO) {
    const newUser = await this.authService.register(registerDto);

    if (!newUser.ok) {
      const error = newUser.error;

      if (error instanceof CouldNotCreateUserError) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new UnauthorizedException(error.message);
      }
    }

    return {
      message: 'Inscription réussie',
      user: this.removePassword(newUser.value),
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Session() session: AuthSession) {
    const connectedUser = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    if (!connectedUser.ok) {
      throw new UnauthorizedException(connectedUser.error.message);
    }

    session.userId = connectedUser.value.id;
    session.role = connectedUser.value.role;

    return {
      message: 'Connexion réussie',
      user: {
        ...connectedUser.value,
      },
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  me(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('logout')
  logout(@Session() session: AuthSession) {
    session.destroy(); // Détruit la session
    return { message: 'Déconnexion réussie' };
  }

  @Post('forgot-password')
  async forgetPassword(@Body() { email }: ForgetPasswordDTO) {
    const result = await this.authService.forgetPassword(email);
    if (!result.ok) {
      if (result.error instanceof MailNotSendedError) {
        throw new InternalServerErrorException(result.error.message);
      }
      // throw new NotFoundException(result.error.message);
      return {
        message:
          'Si un compte avec cet email existe, un email de réinitialisation a été envoyé.',
      };
    }

    return {
      message:
        'Si un compte avec cet email existe, un email de réinitialisation a été envoyé.',
    };
  }

  @Patch('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() { newPassword, confirmNewPassword }: ResetPasswordDTO,
  ) {
    const result = await this.authService.resetPassword(
      token,
      newPassword,
      confirmNewPassword,
    );
    if (!result.ok) {
      if (result.error instanceof PasswordDoNotMatchError) {
        throw new BadRequestException(result.error.message);
      }

      throw new NotFoundException(result.error.message);
    }

    return {
      message: 'Mot de passe réinitialisé avec succès.',
      user: result.value,
    };
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
