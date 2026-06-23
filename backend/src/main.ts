import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX_REQUESTS = 20;
const authRateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

function getAllowedOrigins(): string[] {
  return (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be defined in production.');
  }

  return 'development-session-secret-change-me';
}

function getRequestOrigin(request: Request): string | null {
  const origin = request.get('origin');
  if (origin) return origin;

  const referer = request.get('referer');
  if (!referer) return null;

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function csrfOriginGuard(
  allowedOrigins: string[],
): (request: Request, response: Response, next: NextFunction) => void {
  return (request, response, next) => {
    if (
      process.env.NODE_ENV !== 'production' ||
      !UNSAFE_METHODS.has(request.method)
    ) {
      next();
      return;
    }

    const requestOrigin = getRequestOrigin(request);
    if (!requestOrigin || !allowedOrigins.includes(requestOrigin)) {
      response.status(403).json({ message: 'Origine de requête invalide.' });
      return;
    }

    next();
  };
}

function authRateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const isLimitedRoute =
    request.path === '/api/auth/login' ||
    request.path === '/api/auth/register' ||
    request.path === '/api/auth/forgot-password' ||
    request.path === '/api/auth/reset-password';

  if (!isLimitedRoute) {
    next();
    return;
  }

  const now = Date.now();
  const key = `${request.ip}:${request.path}`;
  const current = authRateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    authRateLimitStore.set(key, {
      count: 1,
      resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS,
    });
    next();
    return;
  }

  if (current.count >= AUTH_RATE_LIMIT_MAX_REQUESTS) {
    response.status(429).json({
      message: 'Trop de tentatives. Réessayez dans quelques minutes.',
    });
    return;
  }

  current.count += 1;
  next();
}

async function bootstrap() {
  const allowedOrigins = getAllowedOrigins();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(csrfOriginGuard(allowedOrigins));
  app.use(authRateLimiter);

  const sessionMiddleware = session({
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  });

  app.use(sessionMiddleware);

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      skipNullProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors: Record<string, string> = {};

        errors.forEach((err) => {
          formattedErrors[err.property] = Object.values(
            err.constraints ?? {},
          ).join(', ');
        });

        return new BadRequestException({
          statusCode: 400,
          message: 'Erreurs de validation',
          errors: formattedErrors,
        });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
