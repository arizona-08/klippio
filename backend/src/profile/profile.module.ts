import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { AmazonS3Module } from "src/amazon/amazon-s3.module";

@Module({
  imports: [PrismaModule, AmazonS3Module],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}