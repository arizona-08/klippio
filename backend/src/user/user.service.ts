import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import bcrypt from 'bcrypt';

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

  async hashPassword(password: string): Promise<string>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}