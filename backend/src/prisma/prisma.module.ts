import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <-- Rend le module disponible dans toute l'application
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporte le service pour l'injection de dépendances
})
export class PrismaModule {}