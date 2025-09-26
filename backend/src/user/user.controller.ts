import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { User } from "./interfaces/user.interface";

@Controller('api/users')
export class UserController{
  constructor(private userService: UserService){}

  @Get()
  async findAll(): Promise<User[]>{
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){
    const user = await this.userService.findOneBy('id', id);

    if(user.ok) return user.value;

    throw new NotFoundException(user.error.message)
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<Partial<User>>{
    const createdUser = await this.userService.createUser(createUserDto);
    if(!createdUser.ok){
      throw new BadRequestException(createdUser.error.message);
    }

    const {password, ...result} = createdUser.value;
    return result
  }
}
