FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Make start script executable and ensure scripts directory exists
RUN if [ -f "scripts/start.sh" ]; then chmod +x scripts/start.sh; fi

# Expose port (Render uses PORT env var, default to 8000)
EXPOSE 8000

# Use startup script that handles migrations
CMD ["/bin/bash", "scripts/start.sh"]


