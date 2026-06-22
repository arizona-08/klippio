# Klippio

Klippio est organise en trois applications:

- `backend`: API NestJS, Prisma et PostgreSQL.
- `frontend/application`: application Next.js principale.
- `frontend/marketing`: site marketing Next.js.

## Demarrage local

1. Copier les variables d'environnement:

```bash
cp .env.example .env
```

2. Installer les dependances dans chaque application:

```bash
cd backend && npm install
cd ../frontend/application && npm install
cd ../marketing && npm install
```

3. Lancer les services de base:

```bash
docker compose up -d db mailer
```

4. Appliquer les migrations Prisma:

```bash
cd backend
npx prisma migrate dev
```

5. Lancer les applications:

```bash
cd backend && npm run start:dev
cd frontend/application && npm run dev
cd frontend/marketing && npm run dev
```

## Checks utiles

```bash
cd backend && npm run lint && npm test
cd frontend/application && npm run lint
cd frontend/marketing && npm run lint
```

`backend npm run lint` verifie seulement le code. Utiliser `npm run lint:fix` pour appliquer les corrections automatiques.

## Securite

- `SESSION_SECRET` est obligatoire en production.
- Les liens de reset password envoient un token brut par email et stockent uniquement son hash en base.
- Ne pas exposer les liens de reset password dans les reponses API hors outils de developpement dedies.
