# Build Stage
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

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

RUN apk add --no-cache openssl

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

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
# Fix Windows CRLF line endings for all text files (prevents Prisma UTF-8 errors)
RUN find /app/prisma -type f -exec sed -i 's/\r$//' {} +
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Set environment variables
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production
ENV TZ=Asia/Taipei

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
