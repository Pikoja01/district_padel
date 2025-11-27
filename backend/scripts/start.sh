#!/bin/bash
set -e

echo "Starting District Padel Backend..."

# Convert asyncpg URL to psycopg2 for migration check
DB_URL_FOR_CHECK=$(echo "$DATABASE_URL" | sed 's/+asyncpg//' | sed 's/postgresql+asyncpg:\/\//postgresql:\/\//')

# Wait for database to be ready (using psycopg2 since alembic uses it)
echo "Waiting for database..."
until python -c "import psycopg2; psycopg2.connect('$DB_URL_FOR_CHECK')" 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is up - executing migrations..."

# Run migrations (alembic uses psycopg2/sync)
alembic upgrade head

echo "Migrations completed. Starting server..."

# Start the application
# Render provides PORT env var, default to 8000
PORT=${PORT:-8000}
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT

