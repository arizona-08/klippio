import { Module } from "@nestjs/common";
import { AmazonS3Service } from "./amazon-s3.service";
import { ImageUploadController } from "./image-upload.controller";

@Module({
  providers: [AmazonS3Service],
  controllers: [ImageUploadController],
  exports: [AmazonS3Service]
})
export class AmazonS3Module {}