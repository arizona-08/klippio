import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateRecentActivityDto {
  @IsInt({each: true})
  @IsNotEmpty({each: true})
  userIds: number[];

  @IsString()
  @IsNotEmpty()
  description: string;
}