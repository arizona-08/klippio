import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import bcrypt from "bcrypt"
import { InvalidCredentialsError } from "src/Error/AuthError";
import { User } from "src/user/interfaces/user.interface";
import { err, ok, Result } from "src/Error/Result";
import { RegisterDTO } from "./dto/register.dto";
import { CouldNotCreateUserError, CouldNotUpdateUserError, PasswordDoNotMatchError, UserAlreadyExistsError, UserNotFoundError } from "src/Error/UserError";
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService){}

  async register(registerDto: RegisterDTO): Promise<Result<User, PasswordDoNotMatchError | UserAlreadyExistsError | CouldNotCreateUserError>>{

    if(registerDto.password !== registerDto.confirmation){
      return err(new PasswordDoNotMatchError('Le mot de passe et sa confirmation ne correspondent pas.'));
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

  async forgetPassword(email: string){
    const user = await this.userService.findOneBy('email', email);
    if(!user.ok){
      return err(new UserNotFoundError('Aucun utilisateur trouvé avec cet email.'));
    }

    const { token, hashedToken } = this.generateToken();
    const expiry = new Date(Date.now() + 3600000); // 1 heure

    const updatedUser = await this.userService.updateUser(user.value.id, {
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: expiry
    });

    if(!updatedUser.ok){
      return err(new CouldNotUpdateUserError(updatedUser.error.message))
    }

    return ok(token)
  }

  async resetPassword(email: string, token: string, newPassword: string, confirmNewPassword: string): Promise<Result<Partial<User>, CouldNotUpdateUserError | PasswordDoNotMatchError>>{
    const storedPasswordToken = await this.userService.getForgotPasswordToken(email);
    if(!storedPasswordToken.ok){
      return err(new UserNotFoundError('Utilisateur non trouvé.'));
    }

    if(!storedPasswordToken.value){
      return err(new CouldNotUpdateUserError('Aucun token de réinitialisation trouvé. Veuillez générer un nouveau token.'));
    }

    if(!storedPasswordToken.value.forgotPasswordTokenExpiry || storedPasswordToken.value.forgotPasswordTokenExpiry < new Date()){
      return err(new CouldNotUpdateUserError('Token de réinitialisation expiré. Veuillez générer un nouveau token.'));
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    if(hashedToken !== storedPasswordToken.value.forgotPasswordToken){
      return err(new CouldNotUpdateUserError('Token de réinitialisation invalide. Veuillez générer un nouveau token.'));
    }

    if(newPassword !== confirmNewPassword){
      return err(new PasswordDoNotMatchError('Le mot de passe et sa confirmation ne correspondent pas.'));
    }

    const updatedUser = await this.userService.updateUser(storedPasswordToken.value.userId, {
      password: newPassword,
      forgotPasswordToken: null,
      forgotPasswordTokenExpiry: null
    });

    if(!updatedUser.ok){
      return err(new CouldNotUpdateUserError(updatedUser.error.message))
    }

    const {password, ...result} = updatedUser.value;
    return ok(result);

  }

  generateToken(){
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
  }
}