import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EditPersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
