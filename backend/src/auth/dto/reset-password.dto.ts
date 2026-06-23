import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(128)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  confirmNewPassword: string;
}
