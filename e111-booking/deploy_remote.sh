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
    mv /root/.env /var/www/booking/.env
fi

# 4. Navigate to project directory
cd /var/www/booking

# 5. Build and run containers
echo "Stopping old containers..."
# Force remove any container using port 3001 (the app port)
CONTAINER_IDS=$(docker ps --format "{{.ID}} {{.Ports}}" | grep ":3001->" | awk '{print $1}')
if [ ! -z "$CONTAINER_IDS" ]; then
    echo "Force removing containers occupying port 3001: $CONTAINER_IDS"
    echo "$CONTAINER_IDS" | xargs docker rm -f
fi

# Standard docker-compose down to clean up networks
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

echo "Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# 6. Seed database (New Step)
echo "Waiting for database initialization (30s)..."
sleep 30

echo "Running database seed..."
# Run the JS seed script inside the container
docker-compose -f docker-compose.prod.yml exec -T app node prisma/seed.js || echo "Warning: Seeding failed. Check if database is ready."

echo "Deployment finished successfully!"

echo "Verifying application status..."
sleep 10
if docker-compose -f docker-compose.prod.yml ps app | grep -q "Up"; then
    echo "Application is running."
else
    echo "ERROR: Application container is not running!"
    docker-compose -f docker-compose.prod.yml logs --tail=50 app
    exit 1
fi
