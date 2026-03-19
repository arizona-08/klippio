import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AmazonS3Module } from './amazon/amazon-s3.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // <-- 2. L'ajouter aux imports
      isGlobal: true,      // Rend les variables d'environnement disponibles dans toute l'app
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    AmazonS3Module,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit{
  constructor(private appService: AppService){}

  async onModuleInit() {
   await this.appService.createAdmin();
  }
}
