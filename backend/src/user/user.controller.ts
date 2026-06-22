import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserNotFoundError } from 'src/Error/UserError';

type UserWithoutPassword = Omit<User, 'password'>;

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOneBy('id', id);

    if (user.ok) return user.value;

    throw new NotFoundException(user.error.message);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<Partial<User>> {
    const createdUser = await this.userService.createUser(createUserDto);
    if (!createdUser.ok) {
      throw new BadRequestException(createdUser.error.message);
    }

    return this.removePassword(createdUser.value);
  }

  @Patch(':id')
  async update(
    @Body() updateUserDto: UpdateUserDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    if (!updatedUser.ok) {
      if (updatedUser.error instanceof UserNotFoundError) {
        throw new NotFoundException(updatedUser.error.message);
      } else {
        throw new BadRequestException(updatedUser.error.message);
      }
    }

    return {
      message: 'Utilisateur mis à jour avec succès.',
      user: this.removePassword(updatedUser.value),
    };
  }

  private removePassword(user: User): UserWithoutPassword {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      forgotPasswordTokenSelector: user.forgotPasswordTokenSelector,
      forgotPasswordToken: user.forgotPasswordToken,
      forgotPasswordTokenExpiry: user.forgotPasswordTokenExpiry,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profilePicture: user.profilePicture,
      bannerPicture: user.bannerPicture,
    };
  }
}
