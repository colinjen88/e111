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

# Create startup script with proper line continuation
RUN printf '#!/bin/sh\n\
echo "Waiting for database..."\n\
sleep 5\n\
echo "Running database migrations..."\n\
npx prisma migrate deploy\n\
echo "Starting application..."\n\
node .output/server/index.mjs\n' > /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/bin/sh", "/app/start.sh"]
