import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import type { CreateUserDTO } from "./dto/create-user.dto";
import { User } from "./interfaces/user.interface";

@Controller('api/users')
export class UserController{
  constructor(private userService: UserService){}

  @Get()
  async findAll(): Promise<User[]>{
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string){
    const user = await this.userService.findOneBy('id', parseInt(id));

    if(user.ok) return user.value;

    return {error: user.error.message, status: HttpStatus.NOT_FOUND}; //plutôt créer des filtres d'exceptions
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<User>{
    return await this.userService.createUser(createUserDto);
  }
}
