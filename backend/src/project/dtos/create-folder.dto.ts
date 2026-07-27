import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @IsUUID() // Ou @IsString() si ce n'est pas un UUID
  @IsNotEmpty()
  projectId: string;

  @IsUUID()
  @IsOptional() // Permet d'accepter le null ou undefined si c'est un dossier racine
  parentFolderId: string | null;
}
