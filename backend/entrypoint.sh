#!/bin/sh

# Stoppe le script si une commande échoue
set -e

# 1. Exécute la migration de la base de données
echo "Running database migrations..."
npx prisma migrate deploy

# 2. Exécute la commande passée au script (ce sera le CMD du Dockerfile)
# 'exec "$@"' est crucial : il remplace le processus du script par celui de votre app,
# ce qui permet à votre app de recevoir correctement les signaux Docker (comme l'arrêt).
exec "$@"