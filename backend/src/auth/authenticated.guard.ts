import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.session.userId;

    if (!userId) {
      // Le Guard renvoie false ou une exception si non connecté
      throw new UnauthorizedException();
    }

    // On récupère l'utilisateur
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException();
    }
    
    // On attache l'utilisateur à la requête pour un accès facile plus tard
    request.user = user; 
    // Le guard renvoie `true` si l'ID utilisateur est dans la session
    return request.session.userId !== undefined;
  }
}