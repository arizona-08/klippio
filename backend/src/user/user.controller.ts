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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserNotFoundError } from 'src/Error/UserError';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { PublicUser, toPublicUser } from './public-user';

@UseGuards(AuthenticatedGuard, AdminGuard)
@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<PublicUser[]> {
    const users = await this.userService.findAllUsers();
    return users.map(toPublicUser);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOneBy('id', id);

    if (user.ok) return toPublicUser(user.value);

    throw new NotFoundException(user.error.message);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<PublicUser> {
    const createdUser = await this.userService.createUser(createUserDto);
    if (!createdUser.ok) {
      throw new BadRequestException(createdUser.error.message);
    }

    return toPublicUser(createdUser.value);
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
      user: toPublicUser(updatedUser.value),
    };
  }
}
