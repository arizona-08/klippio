import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class EditUserPictureDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(5)
  zoom: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(-1000)
  @Max(1000)
  offsetX: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(-1000)
  @Max(1000)
  offsetY: number;

  @IsNotEmpty()
  @IsIn(['PROFILE', 'BANNER'])
  type: 'PROFILE' | 'BANNER';
}
