import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import bcrypt from 'bcrypt';
import { ForgotPasswordTokens, User, UserFilter } from "./interfaces/user.interface";
import { CouldNotUpdateUserError, UserCreationError, UserNotFoundError } from "src/Error/UserError";
import { err, ok, Result } from "src/Error/Result";
import * as crypto from 'crypto';

@Injectable()
export class UserService{
  constructor(private prisma: PrismaService){}

  async findAllUsers(){
    const users = await this.prisma.user.findMany();
    return users;
  }

  async createUser(createUserDto: CreateUserDTO): Promise<Result<User, UserCreationError>>{
    try{
      const createdUser = await this.prisma.user.create(
        {data: {...createUserDto, password: await this.hashPassword(createUserDto.password)}}
      )

      return ok<User>(createdUser);
    } catch(error){
      return err(new UserCreationError(`Erreur lors de la création de l'utilisateur: ${error.message}`));
    }
    
  }

  async hashPassword(password: string): Promise<string>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async findOneBy(filter: UserFilter, value: string | number): Promise<Result<User, UserNotFoundError>>{

    const user = await this.prisma.user.findFirst({
      where: {
        [filter]: value
      }
    });
    
    if(!user) return err(new UserNotFoundError(`Utilisateur avec ${filter}: ${value} introuvable.`));

    return ok(user)
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<Result<User, UserNotFoundError | CouldNotUpdateUserError>>{
    const user = await this.findOneBy('id', id);
    if(!user.ok) return err(user.error); //user.error est de type UserNotFoundError

    if(updateData.password){
      updateData.password = await this.hashPassword(updateData.password);
    }

    if(updateData.email){
      const emailExists = await this.prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id } // Exclude the current user from the check
        }
      });

      if(emailExists){
        return err(new CouldNotUpdateUserError("Email déja utilisé par un autre utilisateur."));
      }
    }

    try{
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData
      });

      return ok(updatedUser);
    } catch(error){
      return err(new CouldNotUpdateUserError(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`));
    }
  }

  async deleteUser(id: number): Promise<Result<User, UserNotFoundError>>{
    const user = await this.findOneBy('id', id);
    if(!user.ok) return err(user.error);

    const deletedUser = await this.prisma.user.delete({
      where: {id}
    });

    return ok(deletedUser);
  }

  async getForgotPasswordToken(email: string): Promise<Result<ForgotPasswordTokens, UserNotFoundError>>{
    const user = await this.findOneBy('email', email);
    if(!user.ok){
      return err(user.error);
    };

    return ok({
      userId: user.value.id,
      forgotPasswordToken: user.value.forgotPasswordToken,
      forgotPasswordTokenExpiry: user.value.forgotPasswordTokenExpiry
    });
  }

}