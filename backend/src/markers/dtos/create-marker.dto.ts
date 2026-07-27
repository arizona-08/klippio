import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export type MarkerPhotoType = {
  label: string;
  comment: string;
};

export class MarkerPhotoDto {
  @IsString()
  @MaxLength(80)
  label: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment: string;
}

export class CreateMarkerDto {
  @IsString()
  @MaxLength(120)
  title: string;

  @Type(() => Number)
  @IsNumber()
  coordX: number;

  @Type(() => Number)
  @IsNumber()
  coordY: number;

  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => MarkerPhotoDto)
  photosMetaData: MarkerPhotoDto[];
}
