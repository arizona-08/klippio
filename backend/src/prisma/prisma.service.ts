import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
  async onModuleInit() {
    // Cette méthode est appelée automatiquement par NestJS quand le module est initialisé.
    // On se connecte à la base de données ici.
    await this.$connect();
  }
}