# Backend Setup Guide

This guide walks you through setting up the District Padel backend from scratch.

## Prerequisites Checklist

- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Python 3.11+ (optional, for local development)

## Step 1: Project Structure Setup

The backend directory should look like this:

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── player.py
│   │   ├── team.py
│   │   └── match.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── player.py
│   │   ├── team.py
│   │   └── match.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── public/
│   │       └── admin/
│   └── services/
│       ├── __init__.py
│       ├── standings.py
│       └── match_service.py
├── alembic/
├── tests/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
├── requirements.txt
└── alembic.ini
```

## Step 2: Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set:
   - `DB_PASSWORD`: Strong password for PostgreSQL
   - `SECRET_KEY`: Random string (generate with `openssl rand -hex 32`)
   - `CORS_ORIGINS`: Your frontend URL (e.g., `http://localhost:5173`)

## Step 3: Docker Setup

### Create docker-compose.yml

This file defines:
- PostgreSQL database service
- FastAPI application service

Both services will communicate via Docker network.

### Create Dockerfile

Defines how to build the FastAPI application container.

## Step 4: Dependencies

Create `requirements.txt` with:
- FastAPI
- SQLAlchemy (async)
- PostgreSQL driver (asyncpg)
- Pydantic
- JWT library (python-jose)
- Password hashing (bcrypt)
- Alembic (migrations)
- Testing tools (pytest, httpx)

## Step 5: Core Configuration

### app/core/config.py
- Loads environment variables
- Defines settings (database URL, secret key, etc.)
- Uses Pydantic Settings for validation

### app/core/database.py
- Creates database connection
- Sets up SQLAlchemy session factory
- Provides async database session dependency

### app/core/security.py
- JWT token creation/validation
- Password hashing/verification
- Authentication utilities

## Step 6: Database Models

### app/models/player.py
- Player table model
- Fields: id, name, email, phone, timestamps

### app/models/team.py
- Team table model
- Fields: id, name, group, active, timestamps
- Relationship to players

### app/models/match.py
- Match table model
- MatchSet table model
- Relationships to teams

### app/models/user.py
- Admin user model
- Fields: id, username, email, hashed_password

## Step 7: API Schemas (Pydantic)

### Request/Response Models
- `TeamCreate`: What admin sends to create team
- `TeamResponse`: What API returns
- `MatchResultCreate`: Match score input
- `StandingsResponse`: League standings output

## Step 8: Business Logic Services

### app/services/standings.py
- `calculate_standings()`: Core ranking logic
- Returns sorted list of team standings

### app/services/match_service.py
- `enter_match_result()`: Validates and saves match result
- Triggers standings recalculation

## Step 9: API Endpoints

### Public Endpoints (app/api/v1/public/)
- `GET /teams`: List teams
- `GET /teams/{id}`: Team details
- `GET /matches`: List matches
- `GET /standings`: League standings

### Admin Endpoints (app/api/v1/admin/)
- `POST /auth/login`: Admin login
- `POST /teams`: Create team
- `PUT /teams/{id}`: Update team
- `POST /matches`: Schedule match
- `POST /matches/{id}/result`: Enter match result

## Step 10: Database Migrations

### Initialize Alembic
```bash
alembic init alembic
```

### Create Initial Migration
```bash
alembic revision --autogenerate -m "Initial schema"
```

This creates migration file with:
- All tables
- Indexes
- Foreign keys
- Constraints

### Apply Migration
```bash
alembic upgrade head
```

## Step 11: Create First Admin User

Two options:

### Option A: Migration Script
Create a migration that inserts first admin user.

### Option B: Python Script
```python
# scripts/create_admin.py
from app.core.security import get_password_hash
from app.models.user import User
# ... create admin user
```

## Step 12: Testing

### Run Tests
```bash
pytest
```

### Test Coverage
```bash
pytest --cov=app --cov-report=html
```

## Step 13: Start Development Server

### With Docker Compose
```bash
docker-compose up --build
```

### Without Docker
```bash
uvicorn app.main:app --reload
```

## Step 14: Verify Setup

1. **Check API docs**: http://localhost:8000/docs
2. **Health check**: http://localhost:8000/health
3. **Test login**: POST to `/api/v1/admin/auth/login`
4. **Create a team**: POST to `/api/v1/admin/teams`
5. **View standings**: GET `/api/v1/public/standings`

## Common Issues & Solutions

### Issue: Port already in use
**Solution**: Change port in docker-compose.yml or stop conflicting service

### Issue: Database connection failed
**Solution**: 
- Check DATABASE_URL in .env
- Ensure PostgreSQL container is running
- Check network connectivity

### Issue: Migration errors
**Solution**:
- Drop and recreate database
- Check model definitions match migration
- Review Alembic env.py configuration

### Issue: CORS errors from frontend
**Solution**: Add frontend URL to CORS_ORIGINS in .env

## Next Steps

1. ✅ Backend API running
2. ⬜ Connect frontend to API
3. ⬜ Create initial teams/players
4. ⬜ Schedule first matches
5. ⬜ Test match result entry
6. ⬜ Verify standings calculation

## Development Workflow

1. **Make changes** to models/endpoints
2. **Create migration** if models changed
3. **Apply migration** to database
4. **Test** locally with Swagger UI
5. **Write tests** for new features
6. **Commit** changes

## Production Deployment Checklist

- [ ] Set strong SECRET_KEY
- [ ] Use managed PostgreSQL
- [ ] Configure proper CORS_ORIGINS
- [ ] Set up SSL/TLS
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Enable database backups
- [ ] Use environment-specific configs
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting
- [ ] Review security settings

## Getting Help

- Check API docs: `/docs` endpoint
- Review logs: `docker-compose logs api`
- Database access: `docker-compose exec db psql -U district_padel`
- Python shell: `docker-compose exec api python`

