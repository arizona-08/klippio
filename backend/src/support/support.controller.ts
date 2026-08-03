import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { User } from 'src/user/interfaces/user.interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SupportService } from './support.service';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@UseGuards(AuthenticatedGuard)
@Controller('api/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  create(@Body() dto: CreateTicketDto, @CurrentUser() user: User) {
    return this.supportService.createTicket(user.id, dto.subject, dto.content);
  }

  @Get('tickets/mine')
  findMine(@CurrentUser() user: User) {
    return this.supportService.findMyTickets(user.id);
  }

  @Get('tickets')
  @UseGuards(AdminGuard)
  findAll() {
    return this.supportService.findAllTickets();
  }

  @Get('tickets/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.supportService.findTicket(id, user.id, user.role === 'ADMIN');
  }

  @Post('tickets/:id/messages')
  addMessage(
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
    @CurrentUser() user: User,
  ) {
    return this.supportService.addMessage(
      id,
      user.id,
      user.role === 'ADMIN',
      dto.content,
    );
  }

  @Patch('tickets/:id/status')
  @UseGuards(AdminGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTicketStatusDto) {
    return this.supportService.updateStatus(id, dto.status);
  }
}
