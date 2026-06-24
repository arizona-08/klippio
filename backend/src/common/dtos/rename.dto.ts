import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RenameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  newName: string;
}
