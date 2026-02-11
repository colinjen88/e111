# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies + prisma CLI
COPY package*.json ./
RUN npm install --omit=dev && npm install prisma@5.22.0

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy built output
COPY --from=builder /app/.output ./.output

# Copy generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set environment variables
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Startup: push schema then start server
CMD sh -c "echo 'Waiting for database...' && sleep 10 && echo 'Pushing schema...' && ./node_modules/.bin/prisma db push --skip-generate && echo 'Starting server...' && node .output/server/index.mjs"
