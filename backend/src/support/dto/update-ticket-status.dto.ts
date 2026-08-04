import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateTicketStatusDto {
  @IsEnum($Enums.SupportTicketStatus)
  status: $Enums.SupportTicketStatus;
}
