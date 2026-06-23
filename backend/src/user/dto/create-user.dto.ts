import { $Enums } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(128)
  password: string;

  @IsEnum($Enums.Role)
  @IsNotEmpty()
  role: $Enums.Role;
}
