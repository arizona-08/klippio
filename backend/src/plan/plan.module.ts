import { Module } from "@nestjs/common";
import { PlanController } from "./plan.controller";
import { PlanService } from "./plan.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { AmazonS3Module } from "src/amazon/amazon-s3.module";

@Module({
  imports: [PrismaModule, AmazonS3Module],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService]
})
export class PlanModule {}