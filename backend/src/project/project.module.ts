import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { AmazonS3Module } from "src/amazon/amazon-s3.module";

@Module({
  imports: [PrismaModule, AmazonS3Module],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}