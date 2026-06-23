import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UploadPlanBodyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsUUID()
  @IsNotEmpty()
  folderId: string;
}
