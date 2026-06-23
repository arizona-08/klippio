import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
