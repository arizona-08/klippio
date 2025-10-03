import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import {BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  });
  
  const sessionMiddleware = session({
       // ⚠️ Mettez cette clé secrète dans vos variables d'environnement !
      secret: process.env.SESSION_SECRET || 'a-very-strong-and-long-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        // Mettez `true` si vous êtes en HTTPS
        secure: process.env.NODE_ENV === 'production', 
        // Durée de vie du cookie (ex: 1 jour)
        maxAge: 1000 * 60 * 60 * 24, 
      },
      // Configuration du stockage de la session avec Prisma
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000, // Vérifie les sessions expirées toutes les 2 minutes
        dbRecordIdIsSessionId: true,
      }),
    })

  app.use(
    sessionMiddleware
  )

  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: false,
    skipNullProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    // Ici, nous redéfinissons la façon dont l'exception est créée
    exceptionFactory: (errors: ValidationError[]) => {
      const formattedErrors = {};

      errors.forEach(err => {
        // err.property est le nom du champ (ex: "firstname")
        // err.constraints est un objet avec les messages d'erreur (ex: { isNotEmpty: "..." })
        formattedErrors[err.property] = Object.values(err.constraints ?? {}).join(', ');
      });
      
      // Retourne une exception standard de NestJS avec notre objet formaté
      return new BadRequestException({
          statusCode: 400,
          message: 'Erreurs de validation',
          errors: formattedErrors,
      });
    },
  }));
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
