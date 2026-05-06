import { IsNotEmpty, IsNumber } from "class-validator";

export class EditUserPictureDto {
  @IsNotEmpty()
  @IsNumber()
  zoom: number;

  @IsNotEmpty()
  @IsNumber()
  offsetX: number;

  @IsNotEmpty()
  @IsNumber()
  offsetY: number;

  @IsNotEmpty()
  type: "PROFILE" | "BANNER";
}