import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

export function getAllowedOrigins(): string[] {
  return (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getSessionSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be defined in production.');
  }

  return 'development-session-secret-change-me';
}

export function getSessionCookieDomain(): string | undefined {
  return process.env.SESSION_COOKIE_DOMAIN?.trim() || undefined;
}

export function createSessionMiddleware() {
  return session({
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: getSessionCookieDomain(),
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
}
