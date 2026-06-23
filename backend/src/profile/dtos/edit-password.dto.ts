import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EditPasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmationPassword: string;
}
