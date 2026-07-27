import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class EditPersonalInfoDto {
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
}
