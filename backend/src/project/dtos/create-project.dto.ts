import { IsString } from "class-validator";

export class CreateProjectDTO {
  @IsString()
  title: string;
  @IsString()
  address: string;
  @IsString()
  zipcode: string;
  @IsString()
  city: string;
}