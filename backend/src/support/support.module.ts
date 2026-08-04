import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RealtimeModule } from 'src/realtime/realtime.module';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({ imports: [PrismaModule, RealtimeModule], controllers: [SupportController], providers: [SupportService] })
export class SupportModule {}
