import { IsNotEmpty, IsNumberString } from 'class-validator';

export class EditUserPictureDto {
  @IsNotEmpty()
  @IsNumberString()
  zoom: number;

  @IsNotEmpty()
  @IsNumberString()
  offsetX: number;

  @IsNotEmpty()
  @IsNumberString()
  offsetY: number;

  @IsNotEmpty()
  type: 'PROFILE' | 'BANNER';
}
