import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { AmazonS3Module } from 'src/amazon/amazon-s3.module';
import { MailModule } from 'src/mail/mail.module';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  imports: [PrismaModule, AmazonS3Module, MailModule, RealtimeModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
