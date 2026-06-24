import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateProjectDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9A-Za-z -]{3,12}$/)
  zipcode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;
}
