import { BadRequestException, Body, Controller, Delete, InternalServerErrorException, NotFoundException, Patch, Post, Query, Session, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthenticatedGuard } from "./authenticated.guard";
import { RegisterDTO } from "./dto/register.dto";
import { CouldNotCreateUserError, PasswordDoNotMatchError } from "src/Error/UserError";
import { ForgetPasswordDTO } from "./dto/forget-password.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";


@Controller('api/auth')
export class AuthController{
  constructor(private authService: AuthService){}

  @Post('register')
  async register(@Body() registerDto: RegisterDTO){
    const newUser = await this.authService.register(registerDto);

    if(!newUser.ok){
      const error = newUser.error;

      if(error instanceof CouldNotCreateUserError){
        throw new InternalServerErrorException(error.message);
      } else {
        throw new UnauthorizedException(error.message);
      }
    }

    const {password, ...result} = newUser.value;
    return {message: 'Inscription réussie', user: result};
  }

  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Session() session: Record<string, any>){
    const connectedUser = await this.authService.login(loginDto.email, loginDto.password);
    if(!connectedUser.ok){
      throw new UnauthorizedException(connectedUser.error.message);
    }

    session.userId = connectedUser.value.id;
    session.role = connectedUser.value.role;

    return {message: 'Connexion réussie', user: connectedUser};
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('logout')
  logout(@Session() session: Record<string, any>) {
    session.destroy(); // Détruit la session
    return { message: 'Déconnexion réussie' };
  }

  @Post('forgot-password')
  async forgetPassword(@Body() { email }: ForgetPasswordDTO) {
    const result = await this.authService.forgetPassword(email);
    if(!result.ok){
      throw new NotFoundException(result.error.message);
    }

    return { 
      message: 'Si un compte avec cet email existe, un email de réinitialisation a été envoyé.',
      email: email,
      token: result.value
    };
  }

  @Patch('reset-password')
  async resetPassword(@Query('token') token: string, @Query('email') email: string, @Body() {newPassword, confirmNewPassword}: ResetPasswordDTO){
    const result = await this.authService.resetPassword(email, token, newPassword, confirmNewPassword);
    if(!result.ok){
      if(result.error instanceof PasswordDoNotMatchError){
        throw new BadRequestException(result.error.message);
      }

      throw new NotFoundException(result.error.message);
    }

    const {password, ...userWithoutPassword} = result.value;
    return {
      message: 'Mot de passe réinitialisé avec succès.',
      user: userWithoutPassword
    }
  }
}