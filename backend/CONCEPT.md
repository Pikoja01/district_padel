# Backend Architecture Concept

## High-Level Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │  FastAPI API │ ──────> │ PostgreSQL  │
│  (React)    │ <────── │   (Python)   │ <────── │  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │   Business   │
                        │    Logic     │
                        │   (Services) │
                        └──────────────┘
```

## Key Design Decisions

### 1. **FastAPI Over Django/Flask**
✅ **Why FastAPI:**
- **Speed**: Async-first, handles concurrent requests efficiently
- **Type Safety**: Automatic validation with Pydantic
- **Modern**: Built for modern Python (async/await)
- **Documentation**: Auto-generated OpenAPI docs
- **Simple**: Less boilerplate than Django, more structured than Flask

❌ **Alternatives Considered:**
- Django: Too heavyweight for API-only, slower
- Flask: No async support, requires more setup
- Node.js/Express: Team preference for Python

### 2. **PostgreSQL Over SQLite/MySQL**
✅ **Why PostgreSQL:**
- **ACID Compliance**: Critical for match results (no data corruption)
- **Relationships**: Excellent foreign key support
- **JSON Support**: Flexible for future features
- **Production Ready**: Industry standard
- **Free & Open Source**: No licensing costs

❌ **Alternatives Considered:**
- SQLite: Too limited for production, no concurrent writes
- MySQL: PostgreSQL is more feature-rich and reliable

### 3. **Docker for Development**
✅ **Why Docker:**
- **Consistency**: Same environment everywhere
- **Easy Setup**: New developers ready in minutes
- **Isolation**: Database separate from API
- **Production Parity**: Matches production setup

### 4. **SQLAlchemy Async ORM**
✅ **Why SQLAlchemy 2.0 Async:**
- **Performance**: Async queries don't block the event loop
- **Type Safety**: Works great with type hints
- **Mature**: Industry standard ORM
- **Migration Support**: Alembic integration

## Data Flow

### Example: Entering Match Results

```
1. Admin logs in → JWT token issued
   POST /api/v1/admin/auth/login
   
2. Admin enters match result
   POST /api/v1/admin/matches/{id}/result
   {
     "sets": [
       { "home_games": 6, "away_games": 4 },
       { "home_games": 3, "away_games": 6 },
       { "home_games": 10, "away_games": 8 }
     ]
   }
   
3. Backend validates:
   ✓ Match exists and is scheduled
   ✓ Sets are valid (1-3 sets)
   ✓ Games are valid scores
   
4. Backend calculates:
   ✓ Winner (team with more sets won)
   ✓ Updates match status to "played"
   ✓ Saves set results to database
   
5. Standings recalculated (on-demand):
   ✓ Fetches all played matches
   ✓ Calculates stats for each team
   ✓ Sorts by ranking rules
   
6. Response returned:
   {
     "match_id": "...",
     "status": "played",
     "winner": "team_id",
     "updated_standings": [...]
   }
```

### Example: Viewing League Standings

```
1. User visits league page
   GET /api/v1/public/standings?group=A
   
2. Backend:
   ✓ Fetches all active teams in group A
   ✓ Fetches all played matches
   ✓ Calculates standings on-the-fly
   ✓ Returns sorted standings
   
3. Frontend displays:
   ✓ Standings table
   ✓ Positions, stats, points
```

## Database Design Philosophy

### Normalization Strategy
- **3NF Normalized**: Players, Teams, Matches are separate tables
- **Junction Tables**: Team-Player relationships (many-to-many)
- **Referential Integrity**: Foreign keys ensure data consistency
- **Soft Deletes**: Teams can be archived (active=false) not deleted

### Future-Proofing
- **Seasons Table**: Support multiple league seasons
- **Tournaments Table**: Separate tournament system
- **Playoffs Table**: Playoff bracket support
- **Extensible**: Easy to add new features without breaking existing

## API Design Philosophy

### RESTful Principles
- **Nouns not Verbs**: `/teams`, `/matches`, not `/getTeams`
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found)

### Versioning
- **URL Versioning**: `/api/v1/` allows future `/api/v2/`
- **Backward Compatible**: Old endpoints stay active during migration

### Public vs Admin Endpoints
- **Separation**: `/public/` vs `/admin/` clearly differentiates access
- **Security**: Admin endpoints require JWT, public don't
- **Future**: Could add role-based permissions (admin, moderator, etc.)

## Security Approach

### Authentication
```
1. Admin logs in with username/password
2. Backend validates credentials
3. JWT token issued (expires in 24 hours)
4. Token included in Authorization header for admin requests
5. Backend validates token on each request
```

### Data Validation
- **Input Validation**: Pydantic schemas validate all requests
- **SQL Injection**: SQLAlchemy ORM prevents SQL injection
- **XSS Prevention**: No HTML rendering, JSON-only responses
- **CORS**: Configured for specific frontend origins only

### Password Security
- **Hashing**: bcrypt with salt rounds
- **Never Store Plaintext**: Passwords never stored or logged

## Performance Strategy

### Current Approach (MVP)
- **On-Demand Calculation**: Standings calculated when requested
- **No Caching**: Simple and correct for small leagues (<50 teams)

### Future Optimization (If Needed)
- **Caching Layer**: Redis for frequently accessed data
- **Materialized Views**: Pre-calculated standings table
- **Background Jobs**: Celery for heavy calculations
- **CDN**: For static assets (if we add them)

### Database Optimization
- **Indexes**: On frequently queried columns (group, date, status)
- **Connection Pooling**: SQLAlchemy manages connections efficiently
- **Query Optimization**: Eager loading to avoid N+1 queries

## Maintainability

### Code Organization
```
app/
├── models/      # What data looks like (SQLAlchemy)
├── schemas/     # What API accepts/returns (Pydantic)
├── api/         # HTTP endpoints (FastAPI routes)
└── services/    # Business logic (pure Python)
```

**Benefits:**
- Clear separation of concerns
- Easy to test (services are isolated)
- Easy to change (modify one layer without affecting others)

### Testing Strategy
- **Unit Tests**: Test services/utilities in isolation
- **Integration Tests**: Test API endpoints with test database
- **Fixture-Based**: pytest fixtures for common test data

### Error Handling
- **Consistent Format**: All errors return same JSON structure
- **Status Codes**: Proper HTTP status codes
- **Error Messages**: Clear, actionable error messages
- **Logging**: All errors logged for debugging

## Scalability Path

### Current Scale (< 100 teams)
- ✅ Single PostgreSQL database
- ✅ Single FastAPI instance
- ✅ On-demand calculations

### Medium Scale (100-500 teams)
- ✅ Add caching (Redis)
- ✅ Pre-calculate standings
- ✅ Database read replicas

### Large Scale (500+ teams)
- ✅ Horizontal scaling (multiple API instances)
- ✅ Load balancer
- ✅ Message queue for heavy tasks
- ✅ Microservices (if needed)

## Why This Architecture Works

### ✅ **Simple to Start**
- Clear file structure
- Docker makes setup trivial
- Auto-documentation helps developers

### ✅ **Easy to Maintain**
- Type hints everywhere
- Clear separation of concerns
- Comprehensive tests

### ✅ **Ready to Scale**
- Async foundation
- Database designed for growth
- Caching strategy defined

### ✅ **Secure by Default**
- Input validation
- Authentication required
- Best practices built-in

### ✅ **Extensible**
- Season support ready
- Tournament system designed
- Playoffs prepared

## Trade-offs Made

### Calculations: On-Demand vs Cached
**Choice**: On-demand initially
- ✅ Simple and correct
- ✅ Always up-to-date
- ❌ Slower with many teams (acceptable for now)
- **Future**: Add caching if needed

### Admin Auth: JWT vs Session
**Choice**: JWT
- ✅ Stateless (easy to scale)
- ✅ Works with mobile apps (future)
- ❌ Can't revoke tokens easily (acceptable trade-off)

### Database: Single vs Multi-tenant
**Choice**: Single-tenant (one league)
- ✅ Simpler schema
- ✅ Better performance
- ❌ Harder to support multiple clubs (acceptable for MVP)

## Next Steps After Initial Setup

1. **Create Admin User**: Migration or script to create first admin
2. **Import Initial Data**: Script to import teams/players from frontend data
3. **Connect Frontend**: Update frontend to call API instead of static data
4. **Add Tests**: Write tests for critical paths (standings, match results)
5. **Deploy**: Set up production environment

## Questions to Consider

1. **Multi-language Support?** 
   - Current: Serbian-focused, but can add i18n later

2. **Real-time Updates?**
   - Current: Polling or manual refresh
   - Future: WebSockets for live standings

3. **Mobile App?**
   - Current: Web-only
   - Future: API ready for mobile apps

4. **Multiple Leagues?**
   - Current: Single league with groups
   - Future: Can add seasons/leagues table

This architecture balances simplicity with future flexibility. We can build the MVP quickly while keeping doors open for growth.

