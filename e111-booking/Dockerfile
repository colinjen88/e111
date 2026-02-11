# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies for Prisma
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy prisma files for migrations
COPY prisma ./prisma/

# Copy built application
COPY --from=builder /app/.output ./.output

# Copy node_modules with Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Running database migrations..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'node .output/server/index.mjs' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
