import { Body, Controller, Delete, Post, Session, UseGuards } from "@nestjs/common";
import type { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthenticatedGuard } from "./authenticated.guard";


@Controller('api/auth')
export class AuthController{
  constructor(private authService: AuthService){}

  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Session() session: Record<string, any>){
    const connectedUser = await this.authService.login(loginDto.email, loginDto.password);
    session.userId = connectedUser.id;
    session.role = connectedUser.role;
    return {message: 'Connexion réussie', user: connectedUser};
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('logout')
  logout(@Session() session: Record<string, any>) {
    session.destroy(); // Détruit la session
    return { message: 'Déconnexion réussie' };
  }
}