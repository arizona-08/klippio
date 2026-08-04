import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from 'src/user/interfaces/user.interface';

type RequestWithUser = Request & {
  user?: User;
};

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!['ADMIN', 'SUPERADMIN'].includes(request.user?.role ?? '')) {
      throw new ForbiddenException('Accès réservé aux administrateurs.');
    }

    return true;
  }
}
