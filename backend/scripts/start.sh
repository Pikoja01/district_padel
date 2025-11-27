#!/bin/bash
set -e

echo "Starting District Padel Backend..."

# Convert asyncpg URL to psycopg2 for migration check
DB_URL_FOR_CHECK=$(echo "$DATABASE_URL" | sed 's/+asyncpg//' | sed 's/postgresql+asyncpg:\/\//postgresql:\/\//')
# Export to environment variable to avoid exposing credentials in process list
export DB_URL_FOR_CHECK

# Wait for database to be ready (using psycopg2 since alembic uses it)
echo "Waiting for database..."
MAX_RETRIES=30
retry_count=0
until python -c "import os, psycopg2, sys; db_url = os.environ.get('DB_URL_FOR_CHECK'); sys.exit(1) if not db_url else None; psycopg2.connect(db_url)" 2>/dev/null; do
  retry_count=$((retry_count + 1))
  if [ $retry_count -ge $MAX_RETRIES ]; then
    echo "Database failed to become ready within 30 seconds. Exiting."
    exit 1
  fi
  echo "Database is unavailable - retry $retry_count/$MAX_RETRIES, sleeping 1s"
  sleep 1
done

echo "Database is up - executing migrations..."

# Run migrations (alembic uses psycopg2/sync)
alembic upgrade head

echo "Migrations completed. Initializing admin user..."

# Initialize admin user if it doesn't exist (non-blocking)
python scripts/init_admin.py || echo "⚠️  Admin initialization failed, but continuing startup..."

echo "Starting server..."

# Start the application
# Render provides PORT env var, default to 8000
PORT=${PORT:-8000}
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT

