# Estágio de construção
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install


COPY . . 

RUN npm run build

# Estágio de produção
FROM node:20-alpine AS production
WORKDIR /app

# Agora o builder terá a pasta .next e a public para entregar
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]