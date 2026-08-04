import { Module } from '@nestjs/common';
import { AmazonS3Module } from 'src/amazon/amazon-s3.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PhotoReportController } from './photo-report.controller';
import { PhotoReportService } from './photo-report.service';

@Module({
  imports: [PrismaModule, AmazonS3Module],
  controllers: [PhotoReportController],
  providers: [PhotoReportService],
})
export class PhotoReportModule {}
