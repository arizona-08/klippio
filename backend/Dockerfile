FROM node:22-alpine AS dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x entrypoint.sh
RUN npx prisma generate

RUN chown -R node:node /app
USER node

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "start:dev"]