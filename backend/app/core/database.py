"""
Database connection and session management
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    future=True,
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# Base class for all models
class Base(DeclarativeBase):
    pass


# Dependency to get database session
async def get_db() -> AsyncSession:
    """
    Dependency function to get database session.
    Use this in FastAPI route dependencies.
    
    IMPORTANT: This dependency does NOT automatically commit or rollback transactions.
    Route handlers must use explicit transaction boundaries for write operations:
    
    For write operations (INSERT, UPDATE, DELETE):
        async with db.begin():
            # Your database operations here
            db.add(object)
            # Transaction commits automatically on successful exit
    
    For read-only operations:
        # No transaction needed, just use the session directly
        result = await db.execute(query)
    
    This pattern ensures deterministic transaction boundaries and follows SQLAlchemy
    async best practices.
    """
    async with AsyncSessionLocal() as session:
        yield session

