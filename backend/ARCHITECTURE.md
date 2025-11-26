# District Padel Backend Architecture

## Overview

This document outlines the backend architecture for the District Padel Club web application. The backend will handle all data management, league calculations, and provide RESTful APIs for both public and admin functionality.

## Technology Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0+ (async)
- **Authentication**: JWT tokens (python-jose)
- **Validation**: Pydantic v2
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: Alembic
- **Testing**: pytest + pytest-asyncio

## Why These Choices?

### FastAPI
- **Performance**: One of the fastest Python frameworks (comparable to Node.js)
- **Async/Await**: Native support for async operations, perfect for database-heavy operations
- **Type Safety**: Built on Pydantic, provides automatic validation and documentation
- **Auto Documentation**: Interactive OpenAPI docs (Swagger) out of the box
- **Modern Python**: Uses Python 3.11+ features, clean and maintainable

### PostgreSQL
- **ACID Compliance**: Ensures data integrity for match results and standings
- **JSON Support**: Can store flexible metadata for future features
- **Relationships**: Excellent foreign key support for complex relationships
- **Full-text Search**: Built-in for future search features
- **Mature Ecosystem**: Well-supported, stable, battle-tested

### Docker
- **Consistency**: Same environment in dev, staging, production
- **Easy Setup**: New developers can start immediately
- **Isolation**: Database, API, and any future services in containers
- **Deployment**: Easy to deploy to any cloud platform

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── core/
│   │   ├── config.py          # Configuration management
│   │   ├── security.py        # Authentication & authorization
│   │   └── database.py        # Database connection & session
│   ├── models/                # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── player.py
│   │   ├── team.py
│   │   ├── match.py
│   │   ├── standings.py       # Cached standings (optional optimization)
│   │   └── user.py            # Admin users
│   ├── schemas/               # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── player.py
│   │   ├── team.py
│   │   ├── match.py
│   │   ├── standings.py
│   │   └── user.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py            # Dependency injection (auth, db sessions)
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── public/        # Public endpoints (no auth required)
│   │   │   │   ├── teams.py
│   │   │   │   ├── matches.py
│   │   │   │   └── standings.py
│   │   │   └── admin/         # Admin endpoints (JWT required)
│   │   │       ├── teams.py
│   │   │       ├── matches.py
│   │   │       ├── players.py
│   │   │       └── users.py
│   ├── services/              # Business logic layer
│   │   ├── __init__.py
│   │   ├── standings.py       # Standings calculation logic
│   │   ├── match_service.py   # Match result processing
│   │   └── team_service.py    # Team management logic
│   └── utils/
│       ├── __init__.py
│       └── validators.py      # Custom validation logic
├── alembic/                   # Database migrations
│   ├── versions/
│   └── env.py
├── tests/                     # Test suite
│   ├── conftest.py
│   ├── test_teams.py
│   ├── test_matches.py
│   └── test_standings.py
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
├── .gitignore
├── requirements.txt
├── pyproject.toml            # Python project config (optional)
└── README.md
```

## Database Schema

### Core Tables

#### `users`
Admin users for managing the system.
```sql
- id (UUID, PK)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- hashed_password (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `players`
Individual players (can belong to multiple teams over time).
```sql
- id (UUID, PK)
- name (VARCHAR, NOT NULL)
- email (VARCHAR, OPTIONAL)
- phone (VARCHAR, OPTIONAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `teams`
Teams participating in the league.
```sql
- id (UUID, PK)
- name (VARCHAR, NOT NULL)
- group (ENUM: 'A', 'B')
- active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(name) -- Teams should have unique names
```

#### `team_players` (Junction Table)
Links players to teams with their role.
```sql
- id (UUID, PK)
- team_id (UUID, FK -> teams.id)
- player_id (UUID, FK -> players.id)
- role (ENUM: 'main', 'reserve')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(team_id, player_id) -- A player can only appear once per team
- CHECK: At least 2 main players per team (enforced in application logic)
- CHECK: Maximum 1 reserve player per team (enforced in application logic)
```

#### `matches`
Matches between teams.
```sql
- id (UUID, PK)
- date (DATE, NOT NULL)
- group (ENUM: 'A', 'B')
- home_team_id (UUID, FK -> teams.id)
- away_team_id (UUID, FK -> teams.id)
- status (ENUM: 'scheduled', 'played', 'cancelled')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- CHECK: home_team_id != away_team_id
```

#### `match_sets`
Individual set results (1-3 sets per match).
```sql
- id (UUID, PK)
- match_id (UUID, FK -> matches.id, CASCADE DELETE)
- set_number (INTEGER, 1-3)
- home_games (INTEGER)
- away_games (INTEGER)
- created_at (TIMESTAMP)
- UNIQUE(match_id, set_number)
- CHECK: set_number BETWEEN 1 AND 3
```

### Future Tables (Tournaments & Playoffs)

#### `seasons`
League seasons (allows historical data).
```sql
- id (UUID, PK)
- name (VARCHAR, e.g., "2025 Spring League")
- start_date (DATE)
- end_date (DATE)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### `tournaments`
Future tournament management.
```sql
- id (UUID, PK)
- name (VARCHAR)
- season_id (UUID, FK -> seasons.id)
- format (VARCHAR, e.g., "single_elimination", "round_robin")
- start_date (DATE)
- end_date (DATE)
- status (ENUM: 'draft', 'active', 'completed')
```

#### `playoffs`
Playoff brackets.
```sql
- id (UUID, PK)
- season_id (UUID, FK -> seasons.id)
- group (ENUM: 'A', 'B', 'combined')
- bracket_stage (VARCHAR, e.g., "quarterfinals", "semifinals", "final")
- team1_id (UUID, FK -> teams.id, NULLABLE)
- team2_id (UUID, FK -> teams.id, NULLABLE)
- match_id (UUID, FK -> matches.id, NULLABLE)
- winner_id (UUID, FK -> teams.id, NULLABLE)
- status (ENUM: 'pending', 'scheduled', 'played')
```

## API Endpoints

### Public Endpoints (No Authentication)

#### Teams
- `GET /api/v1/public/teams` - List all active teams
  - Query params: `group` (A|B|all), `active` (bool)
- `GET /api/v1/public/teams/{team_id}` - Get team details with players

#### Matches
- `GET /api/v1/public/matches` - List all matches
  - Query params: `group` (A|B|all), `status` (scheduled|played|all), `date_from`, `date_to`
- `GET /api/v1/public/matches/{match_id}` - Get match details

#### Standings
- `GET /api/v1/public/standings` - Get league standings
  - Query params: `group` (A|B|all)
- `GET /api/v1/public/standings/teams/{team_id}` - Get specific team's standings

### Admin Endpoints (JWT Authentication Required)

#### Teams Management
- `POST /api/v1/admin/teams` - Create a new team
  - Body: `{ name, group, players: [{ player_id, role }] }`
- `GET /api/v1/admin/teams` - List all teams (including archived)
- `GET /api/v1/admin/teams/{team_id}` - Get team details
- `PUT /api/v1/admin/teams/{team_id}` - Update team (name, group, players)
- `DELETE /api/v1/admin/teams/{team_id}` - Archive team (soft delete)
- `POST /api/v1/admin/teams/{team_id}/activate` - Reactivate archived team

#### Players Management
- `POST /api/v1/admin/players` - Create a new player
- `GET /api/v1/admin/players` - List all players
- `PUT /api/v1/admin/players/{player_id}` - Update player info
- `GET /api/v1/admin/players/{player_id}/teams` - Get all teams a player belongs to

#### Matches Management
- `POST /api/v1/admin/matches` - Schedule a new match
  - Body: `{ date, group, home_team_id, away_team_id }`
- `GET /api/v1/admin/matches` - List all matches
- `PUT /api/v1/admin/matches/{match_id}` - Update match (date, teams, etc.)
- `POST /api/v1/admin/matches/{match_id}/result` - Enter match result
  - Body: `{ sets: [{ home_games, away_games }] }` (1-3 sets)
- `DELETE /api/v1/admin/matches/{match_id}` - Cancel/delete match

#### Authentication
- `POST /api/v1/admin/auth/login` - Login and get JWT token
  - Body: `{ username, password }`
- `POST /api/v1/admin/auth/refresh` - Refresh JWT token
- `POST /api/v1/admin/auth/logout` - Logout (blacklist token, if implementing)

#### Dashboard/Overview
- `GET /api/v1/admin/dashboard/stats` - Get league statistics
  - Returns: total teams, active matches, completed matches, etc.

## Business Logic

### Standings Calculation

The standings are calculated dynamically from match results (not stored in database by default for data integrity).

**Ranking Rules:**
1. **Points** (descending) - 3 points per win, 0 per loss
2. **Matches Won** (descending) - tiebreaker
3. **Set Difference** (descending) - sets_for - sets_against
4. **Game Difference** (descending) - games_for - games_against
5. **Team Name** (alphabetical) - final tiebreaker

**Optimization Consideration:**
- For production with many teams/matches, consider caching standings in a `standings_cache` table
- Invalidate cache when match results are updated
- Calculate on-demand if cache is stale

### Match Result Validation

When entering match results:
1. Validate that match status is "scheduled"
2. Validate sets array has 1-3 sets
3. Validate games are valid (6-7 for normal sets, 10 for super tiebreak)
4. Determine winner (team with more sets won)
5. Update match status to "played"
6. Trigger standings recalculation (or cache invalidation)

### Team Validation

When creating/updating teams:
1. At least 2 players required
2. Maximum 3 players total
3. At least 2 must be "main" role
4. Maximum 1 "reserve" role
5. Team name must be unique
6. Teams must belong to a valid group (A or B)

## Authentication & Security

### JWT-Based Authentication
- Admin endpoints require `Authorization: Bearer <token>` header
- Tokens expire after 24 hours (configurable)
- Refresh tokens can be implemented for better UX

### Password Security
- Passwords hashed using bcrypt
- Minimum password requirements enforced
- Rate limiting on login endpoints to prevent brute force

### API Security
- CORS configured for frontend domain
- Rate limiting on all endpoints
- Input validation on all requests (Pydantic)
- SQL injection prevention (SQLAlchemy ORM)

## Docker Setup

### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: district_padel
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: district_padel
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U district_padel"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://district_padel:${DB_PASSWORD}@db:5432/district_padel
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: HS256
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres_data:
```

## Environment Configuration

### .env.example
```env
# Database
DATABASE_URL=postgresql+asyncpg://district_padel:your_password@localhost:5432/district_padel
DB_PASSWORD=your_secure_password

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# API
API_V1_STR=/api/v1
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=True
```

## Development Workflow

1. **Local Development:**
   - `docker-compose up -d` - Start database
   - `uvicorn app.main:app --reload` - Start API server
   - Frontend connects to `http://localhost:8000`

2. **Database Migrations:**
   - `alembic revision --autogenerate -m "description"` - Create migration
   - `alembic upgrade head` - Apply migrations

3. **Testing:**
   - `pytest` - Run all tests
   - `pytest tests/test_standings.py -v` - Run specific test file

## Future Enhancements

### Tournaments
- Add `tournaments` table and endpoints
- Tournament bracket generation
- Tournament-specific match scheduling

### Playoffs
- Automatic playoff bracket generation based on league standings
- Multi-stage playoff system (quarterfinals, semifinals, finals)
- Playoff-specific match results

### Analytics
- Player statistics (win rate, sets won/lost, etc.)
- Team performance over time
- Match history analytics

### Notifications
- Email notifications for scheduled matches
- Match result notifications
- Standings update alerts

### API Versioning
- Maintain `/api/v1/` structure
- Future versions: `/api/v2/` for breaking changes

## Performance Considerations

1. **Database Indexing:**
   - Index on `teams.group`
   - Index on `matches.date`
   - Index on `matches.status`
   - Composite index on `matches(home_team_id, away_team_id)`

2. **Query Optimization:**
   - Use select_related for foreign keys (SQLAlchemy)
   - Pagination for large result sets
   - Eager loading for nested relationships

3. **Caching Strategy:**
   - Cache standings calculations
   - Cache frequently accessed team/match data (Redis optional)
   - Invalidate cache on data updates

## Deployment Considerations

1. **Production Environment:**
   - Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
   - Environment variables for secrets
   - SSL/TLS for all connections
   - Process manager (Gunicorn + Uvicorn workers)

2. **Monitoring:**
   - Logging (structured logs)
   - Error tracking (Sentry)
   - Performance monitoring (APM tools)

3. **Backup Strategy:**
   - Automated database backups
   - Point-in-time recovery capability

## Conclusion

This architecture provides:
- ✅ Scalable foundation for current league system
- ✅ Extensible design for tournaments and playoffs
- ✅ Maintainable code structure
- ✅ Secure admin access
- ✅ Fast performance with async operations
- ✅ Easy deployment with Docker
- ✅ Clear separation of concerns

The system is designed to grow with your needs while maintaining clean, testable code.

