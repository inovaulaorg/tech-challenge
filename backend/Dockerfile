# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas arquivos de dependências para melhor cache
COPY package*.json ./
COPY tsconfig.json ./

# Instala todas as dependências (incluindo dev)
RUN npm ci

# Copia o código-fonte
COPY src ./src

# Build da aplicação
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copia build gerado
COPY --from=builder /app/dist ./dist

# Cria usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]