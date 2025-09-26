import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import bcrypt from "bcrypt"
import { InvalidCredentialsError } from "src/Error/AuthError";
import { User } from "src/user/interfaces/user.interface";
import { err, ok, Result } from "src/Error/Result";
import { RegisterDTO } from "./dto/register.dto";
import { CouldNotCreateUserError, PasswordDoNotMathError, UserAlreadyExistsError } from "src/Error/UserError";

@Injectable()
export class AuthService {
  constructor(private userService: UserService){}

  async register(registerDto: RegisterDTO): Promise<Result<User, PasswordDoNotMathError | UserAlreadyExistsError | CouldNotCreateUserError>>{

    if(registerDto.password !== registerDto.confirmation){
      return err(new PasswordDoNotMathError('Le mot de passe et sa confirmation ne correspondent pas.'));
    }

    const existingUser = await this.userService.findOneBy('email', registerDto.email);
    if(existingUser.ok){
      return err(new UserAlreadyExistsError('Un utilisateur avec cet email existe déjà.'));
    }

    const {confirmation, ...result} = registerDto; 
    const newUser = await this.userService.createUser(result)
    if(!newUser.ok){
      return err(new CouldNotCreateUserError(`Impossible de créer l'utilisateur: ${newUser.error.message}`));
    }

    return ok(newUser.value);

  }

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