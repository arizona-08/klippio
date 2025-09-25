import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(private userService: UserService){}

  async login(email: string, userPassword: string){
    const user = await this.userService.findOneBy('email', email);
    if(!user){
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(userPassword, user.password);
    if(!isPasswordValid){
      throw new UnauthorizedException('Identifiants invalides');
    }

    const {password, ...result} = user;
    return result;
  }
}