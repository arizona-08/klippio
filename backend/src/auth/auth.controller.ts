import { Body, Controller, Delete, InternalServerErrorException, Post, Session, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthenticatedGuard } from "./authenticated.guard";
import { RegisterDTO } from "./dto/register.dto";
import { CouldNotCreateUserError } from "src/Error/UserError";


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
}