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


def validate_cors_origins_on_startup() -> None:
    """
    Validate the application's CORS origins configuration and emit warnings or confirmation at startup.
    
    Reads `settings.CORS_ORIGINS` and `settings.cors_origins_list`. If the raw `CORS_ORIGINS` value is missing or blank, prints a multi-line warning with deployment guidance to stderr and returns without exiting; if the parsed origins list is empty, prints a warning including the raw value and returns; if valid, prints a success message with the configured origins. Any exception raised during validation is caught and a warning with the exception message is printed to stderr.
    """
    try:
        cors_origins = settings.CORS_ORIGINS
        cors_origins_list = settings.cors_origins_list
        
        if not cors_origins or not cors_origins.strip():
            print("=" * 80, file=sys.stderr)
            print("WARNING: CORS_ORIGINS is not set", file=sys.stderr)
            print("=" * 80, file=sys.stderr)
            print("\nCORS requests will be blocked. Please set CORS_ORIGINS environment variable.", file=sys.stderr)
            print("\nFor deployment on Render:", file=sys.stderr)
            print("  1. Go to your web service → Environment tab", file=sys.stderr)
            print("  2. Set CORS_ORIGINS to your frontend URL(s)", file=sys.stderr)
            print("  3. Format: https://your-frontend.vercel.app (comma-separated for multiple)", file=sys.stderr)
            print("\nExample: https://district-padel.vercel.app", file=sys.stderr)
            print("=" * 80, file=sys.stderr)
            return  # Don't exit, just warn
        
        if not cors_origins_list:
            print("=" * 80, file=sys.stderr)
            print("WARNING: CORS_ORIGINS is empty after parsing", file=sys.stderr)
            print("=" * 80, file=sys.stderr)
            print(f"\nCORS_ORIGINS value: '{cors_origins}'", file=sys.stderr)
            print("CORS requests will be blocked.", file=sys.stderr)
            print("=" * 80, file=sys.stderr)
            return
        
        print(f"✓ CORS configured for origins: {cors_origins_list}", flush=True)
    except Exception as e:
        print(f"WARNING: Failed to validate CORS_ORIGINS: {e}", file=sys.stderr, flush=True)


def validate_database_url_on_startup() -> None:
    """
    Validate the DATABASE_URL environment setting at application startup.
    
    Prints a clearly formatted error to stderr and exits the process with code 1 if DATABASE_URL is missing, only whitespace, or does not start with the expected PostgreSQL prefixes. On success the function returns without side effects.
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
    Provide the FastAPI lifespan context manager that runs startup and shutdown tasks.
    
    On startup, validates the DATABASE_URL and CORS origins and prints a confirmation message. On shutdown, performs no actions (placeholder for future cleanup).
    """
    # Startup: Validate database URL configuration
    validate_database_url_on_startup()
    print("✓ DATABASE_URL validated successfully", flush=True)
    
    # Startup: Validate CORS configuration
    validate_cors_origins_on_startup()
    
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
# Log CORS origins for debugging (in production, check logs to verify)
cors_origins = settings.cors_origins_list
print(f"CORS Origins configured: {cors_origins}", flush=True)
print(f"CORS_ORIGINS env var: {settings.CORS_ORIGINS}", flush=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
