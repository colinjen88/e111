#!/bin/bash
set -e

echo "=== E111 Hard Reset Start ==="

cd /var/www/booking

echo "[1/4] Stopping containers and removing volumes..."
# -v is critical here to wipe the postgres volume with the wrong password
docker-compose -f docker-compose.prod.yml down -v --remove-orphans

echo "[2/4] Rebuilding and starting..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "[3/4] Waiting for Database to be ready (10s)..."
sleep 10

echo "[4/4] Seeding Database..."
docker-compose -f docker-compose.prod.yml exec -T app npx prisma db seed

echo "=== Reset Complete ==="
echo "Checking logs..."
docker-compose -f docker-compose.prod.yml ps
