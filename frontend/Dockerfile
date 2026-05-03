# EstÃ¡gio de construÃ§Ã£o
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

# EstÃ¡gio de produÃ§Ã£o
FROM node:20-alpine AS production
WORKDIR /app
# O package.json do frontend usa next build que gera a pasta .next
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
