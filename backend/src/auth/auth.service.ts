import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import bcrypt from "bcrypt"
import { InvalidCredentialsError } from "src/Error/AuthError";
import { User } from "src/user/interfaces/user.interface";
import { err, ok, Result } from "src/Error/Result";

@Injectable()
export class AuthService {
  constructor(private userService: UserService){}

  async login(email: string, userPassword: string): Promise<Result<Partial<User>, InvalidCredentialsError>>{
    const user = await this.userService.findOneBy('email', email);
    if(!user.ok){
      return err(new InvalidCredentialsError('Identifiants invalides'));
    }

    const isPasswordValid = await bcrypt.compare(userPassword, user.value.password);
    if(!isPasswordValid){
      return err(new InvalidCredentialsError('Identifiants invalides'));
    }

    const {password, ...result} = user.value;
    return ok(result);
  }
}