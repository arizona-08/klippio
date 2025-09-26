import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import bcrypt from 'bcrypt';
import { User, UserFilter } from "./interfaces/user.interface";
import { UserNotFoundError } from "src/Error/UserError";
import { err, ok, Result } from "src/Error/Result";

@Injectable()
export class UserService{
  constructor(private prisma: PrismaService){}

  async findAllUsers(){
    const users = await this.prisma.user.findMany();
    return users;
  }

  async createUser(createUserDto: CreateUserDTO){
    return await this.prisma.user.create(
      {data: {...createUserDto, password: await this.hashPassword(createUserDto.password)}}
    )
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

  async hashPassword(password: string): Promise<string>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}