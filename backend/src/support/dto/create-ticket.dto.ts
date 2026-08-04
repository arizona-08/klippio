import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content: string;
}
