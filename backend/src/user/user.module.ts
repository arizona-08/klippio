import { Global, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AmazonS3Module } from "src/amazon/amazon-s3.module";

@Global()
@Module({
  imports: [AmazonS3Module],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule{}