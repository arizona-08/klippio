import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { RecentActivityController } from './recent-activity.controller';
import { RecentActivityService } from './recent-activyty.service';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [RecentActivityController],
  providers: [RecentActivityService],
})
export class RecentActivityModule {}
