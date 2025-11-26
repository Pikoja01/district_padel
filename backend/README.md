# District Padel Backend

FastAPI backend for District Padel Club league management system.

## 📚 Documentation

- **[ROADMAP.md](./ROADMAP.md)** - Complete implementation roadmap with phases and timelines
- **[ROADMAP_QUICK_REFERENCE.md](./ROADMAP_QUICK_REFERENCE.md)** - One-page roadmap overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed technical architecture
- **[CONCEPT.md](./CONCEPT.md)** - High-level design decisions
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Step-by-step setup instructions
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Detailed task checklist
- **[SUMMARY.md](./SUMMARY.md)** - Executive summary

**New to this project?** Start with the [ROADMAP_QUICK_REFERENCE.md](./ROADMAP_QUICK_REFERENCE.md) for a quick overview.

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.11+ (for local development without Docker)

### Development Setup

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   This starts:
   - PostgreSQL database on port 5432
   - FastAPI server on port 8000 (with hot reload)

4. **Run database migrations:**
   ```bash
   docker-compose exec api alembic upgrade head
   ```

5. **Access the API:**
   - API docs (Swagger): http://localhost:8000/docs
   - Alternative docs (ReDoc): http://localhost:8000/redoc
   - Health check: http://localhost:8000/health

### Local Development (Without Docker)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start PostgreSQL** (or use Docker just for DB):
   ```bash
   docker-compose up -d db
   ```

3. **Run migrations:**
   ```bash
   alembic upgrade head
   ```

4. **Start the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

```
backend/
├── app/                    # Application code
│   ├── api/               # API endpoints
│   ├── core/              # Core configuration
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic schemas
│   └── services/          # Business logic
├── alembic/               # Database migrations
├── tests/                 # Test suite
└── docker/                # Docker configuration
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Environment Variables

Key environment variables (see `.env.example`):

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key (generate a strong random string)
- `CORS_ORIGINS`: Allowed frontend origins (comma-separated)

## Database Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback:
```bash
alembic downgrade -1
```

## Testing

Run tests:
```bash
pytest
```

With coverage:
```bash
pytest --cov=app --cov-report=html
```

## Development Tips

1. **Auto-reload**: The server automatically reloads on code changes when using `--reload`
2. **Database browser**: Use pgAdmin or DBeaver to inspect the database
3. **API testing**: Use the Swagger UI at `/docs` to test endpoints interactively

## Next Steps

1. Create initial admin user (via migration or script)
2. Set up CI/CD pipeline
3. Configure production environment variables
4. Set up monitoring and logging

