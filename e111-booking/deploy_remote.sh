#!/bin/bash

# Ensure script fails on first error
set -e

echo "Deploying to /var/www/booking..."

# 1. Create directory if it doesn't exist
mkdir -p /var/www/booking

# 2. Extract files
echo "Extracting files from /root/deploy.tar.gz..."
tar -xzvf /root/deploy.tar.gz -C /var/www/booking

# 3. Handle environment file
if [ -f /root/.env ]; then
    echo "Updating .env file..."
    sed -i '/^DATABASE_URL=/d' /root/.env  # Remove local DATABASE_URL to prevent conflict
    mv /root/.env /var/www/booking/.env
fi

# 4. Navigate to project directory
cd /var/www/booking

# 5. Build and run containers

echo "Stopping old containers..."
# Force remove any container using port 9088
CONTAINER_IDS=$(docker ps --format "{{.ID}} {{.Ports}}" | grep ":9088->" | awk '{print $1}')
if [ ! -z "$CONTAINER_IDS" ]; then
    echo "Force removing containers occupying port 9088: $CONTAINER_IDS"
    echo "$CONTAINER_IDS" | xargs docker rm -f
fi

# Standard docker-compose down
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

echo "Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# 6. Seed/Push Database
echo "Waiting for database initialization (15s)..."
sleep 15

echo "Checking database connection..."
# We use docker-entrypoint's logic (which runs prisma db push) inside the container.
# If the container crashes, it means entrypoint failed.

echo "Verifying application status..."
sleep 10
if docker-compose -f docker-compose.prod.yml ps app | grep -q "Up"; then
    echo "Application is running."
else
    echo "ERROR: Application container failed to start!"
    echo "=== APP LOGS ==="
    docker-compose -f docker-compose.prod.yml logs --tail=100 app
    exit 1
fi
