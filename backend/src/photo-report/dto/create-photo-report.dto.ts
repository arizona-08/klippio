import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePhotoReportDto {
  @IsUUID()
  photoId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
