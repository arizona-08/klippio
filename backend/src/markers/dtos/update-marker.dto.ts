import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class ExistingMarkerPhotoUpdateDto {
  @IsUUID()
  identifier: string;

  @IsString()
  @MaxLength(80)
  label: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment: string;
}

class NewMarkerPhotoDto {
  @IsString()
  @MaxLength(80)
  label: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment: string;
}

export class UpdateMarkerDto {
  @IsString()
  @MaxLength(120)
  title: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  coordX: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  coordY: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ExistingMarkerPhotoUpdateDto)
  existingPhotosToUpdate?: ExistingMarkerPhotoUpdateDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => NewMarkerPhotoDto)
  newPhotosMetadata?: NewMarkerPhotoDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUUID(undefined, { each: true })
  deletedPhotoIdentifiers?: string[];
}
