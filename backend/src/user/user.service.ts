import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import bcrypt from 'bcrypt';
import { UserFilter } from "./interfaces/user.interface";

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

  async findOneBy(filter: UserFilter, value: string | number){
    const user = await this.prisma.user.findFirst({
      where: {
        [filter]: value
      }
    });
    return user
  }

  async hashPassword(password: string): Promise<string>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}