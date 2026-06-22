import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from 'src/user/user.service';
import type { User } from 'src/user/interfaces/user.interface';

type AuthenticatedRequest = Request & {
  session: Request['session'] & {
    userId?: number;
  };
  user?: User;
};

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.session.userId;

    if (!userId) {
      // Le Guard renvoie false ou une exception si non connecté
      throw new UnauthorizedException();
    }

    // On récupère l'utilisateur
    const user = await this.userService.findOneBy('id', userId);

    if (!user.ok) {
      throw new UnauthorizedException();
    }

    // On attache l'utilisateur à la requête pour un accès facile plus tard
    request.user = user.value;
    // Le guard renvoie `true` si l'ID utilisateur est dans la session
    return true;
  }
}
