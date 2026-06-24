import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRecentActivityDto {
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  @IsNotEmpty({ each: true })
  userIds: number[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;
}
