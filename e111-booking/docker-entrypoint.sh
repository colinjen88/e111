#!/bin/sh
set -e

echo "=== E111 Booking System Starting ==="

# Wait for database to be ready (max 60 seconds)
echo "Waiting for database..."
MAX_RETRIES=12
RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
  if echo "SELECT 1" | ./node_modules/.bin/prisma db execute --stdin 2>/dev/null; then
    echo "Database is ready!"
    break
  fi
  RETRY=$((RETRY + 1))
  echo "Database not ready (attempt $RETRY/$MAX_RETRIES), waiting 5s..."
  sleep 5
done

if [ $RETRY -eq $MAX_RETRIES ]; then
  echo "WARNING: Database may not be ready after ${MAX_RETRIES} attempts"
fi

# Push schema to database
echo "Pushing database schema..."
if ./node_modules/.bin/prisma db push --skip-generate; then
  echo "Schema pushed successfully!"
else
  echo "WARNING: Schema push failed. The application may not work correctly."
fi

# Start the application
echo "Starting application..."
exec node .output/server/index.mjs
