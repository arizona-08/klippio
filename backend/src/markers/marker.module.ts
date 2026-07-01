import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MarkerController } from './marker.controller';
import { MarkerService } from './marker.service';
import { AmazonS3Module } from 'src/amazon/amazon-s3.module';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  imports: [PrismaModule, AmazonS3Module, RealtimeModule],
  controllers: [MarkerController],
  providers: [MarkerService],
})
export class MarkerModule {}
