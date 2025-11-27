"""
Main FastAPI application entry point
"""
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.public.router import router as public_router
from app.api.v1.admin.router import router as admin_router


def validate_database_url_on_startup() -> None:
    """
    Validate DATABASE_URL on application startup.
    This ensures the service fails fast with a clear error message if DATABASE_URL
    is missing or malformed, preventing silent failures later.
    """
    try:
        # Settings validation happens during import, but we can provide better error messages
        database_url = settings.DATABASE_URL
        
        # Additional validation: check that URL is not just whitespace
        if not database_url or not database_url.strip():
            print("=" * 80, file=sys.stderr)
            print("ERROR: DATABASE_URL is missing or empty", file=sys.stderr)
            print("=" * 80, file=sys.stderr)
            print("\nPlease set the DATABASE_URL environment variable.", file=sys.stderr)
            print("\nFor deployment on Render:", file=sys.stderr)
            print("  1. Create a PostgreSQL database in Render Dashboard", file=sys.stderr)
            print("  2. Copy the Internal Database URL from the database dashboard", file=sys.stderr)
            print("  3. Set it as DATABASE_URL in your web service environment variables", file=sys.stderr)
            print("  4. Ensure the URL uses format: postgresql+asyncpg://user:pass@host:port/dbname", file=sys.stderr)
            print("\nSee backend/docs/DEPLOYMENT.md for detailed setup instructions.", file=sys.stderr)
            print("=" * 80, file=sys.stderr)
            sys.exit(1)
        
        # Validate URL format (basic check)
        if not (database_url.startswith("postgresql://") or database_url.startswith("postgresql+asyncpg://")):
            print("=" * 80, file=sys.stderr)
            print("ERROR: DATABASE_URL has invalid format", file=sys.stderr)
            print("=" * 80, file=sys.stderr)
            print(f"\nExpected format: postgresql[+asyncpg]://user:password@host:port/database", file=sys.stderr)
            print(f"\nCurrent value (first 50 chars): {database_url[:50]}...", file=sys.stderr)
            print("\nPlease verify your DATABASE_URL is correctly formatted.", file=sys.stderr)
            print("See backend/docs/DEPLOYMENT.md for correct format and examples.", file=sys.stderr)
            print("=" * 80, file=sys.stderr)
            sys.exit(1)
            
    except Exception as e:
        # Catch any validation errors from Pydantic settings
        error_msg = str(e)
        print("=" * 80, file=sys.stderr)
        print("ERROR: Failed to validate DATABASE_URL configuration", file=sys.stderr)
        print("=" * 80, file=sys.stderr)
        print(f"\n{error_msg}", file=sys.stderr)
        print("\nFor deployment setup instructions, see: backend/docs/DEPLOYMENT.md", file=sys.stderr)
        print("=" * 80, file=sys.stderr)
        sys.exit(1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    Validates DATABASE_URL on startup before the application serves requests.
    """
    # Startup: Validate database URL configuration
    validate_database_url_on_startup()
    print("✓ DATABASE_URL validated successfully", flush=True)
    
    yield
    
    # Shutdown: Add any cleanup logic here if needed in the future
    pass


# Create FastAPI app with lifespan events
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    redirect_slashes=False,  # Disable automatic redirects to avoid CORS issues
    lifespan=lifespan,
)

# Configure CORS - must be added before routers to handle error responses
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=settings.cors_allow_methods_list,
    allow_headers=settings.cors_allow_headers_list,
    expose_headers=settings.cors_expose_headers_list,
)

# Include routers
app.include_router(public_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(admin_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "District Padel Backend API",
        "version": "0.1.0",
        "docs": "/docs",
        "api_v1": f"{settings.API_V1_STR}/public",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

