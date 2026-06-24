import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class EditPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(128)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  confirmationPassword: string;
}
