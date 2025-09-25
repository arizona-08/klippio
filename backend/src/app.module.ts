import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // <-- 2. L'ajouter aux imports
      isGlobal: true,      // Rend les variables d'environnement disponibles dans toute l'app
    }),
    PrismaModule,
    UserModule
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
