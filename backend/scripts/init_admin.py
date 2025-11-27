"""
Initialize admin user on startup if it doesn't exist.
This script is called automatically during deployment.
"""
import asyncio
import sys
import os
from pathlib import Path

# Add parent directory to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.models.user import User
from app.core.security import get_password_hash


async def init_admin_user():
    """Create admin user if it doesn't exist"""
    # Get admin credentials from environment variables
    admin_username = os.getenv("ADMIN_USERNAME", "admin@test.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    admin_email = os.getenv("ADMIN_EMAIL", admin_username)
    
    # Create database engine
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    try:
        async with async_session() as session:
            # Check if admin user already exists
            result = await session.execute(
                select(User).where(User.username == admin_username)
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print(f"✅ Admin user '{admin_username}' already exists. Skipping creation.")
                return
            
            # Create new admin user
            hashed_password = get_password_hash(admin_password)
            admin_user = User(
                username=admin_username,
                email=admin_email,
                hashed_password=hashed_password,
                is_active=True,
            )
            
            session.add(admin_user)
            await session.commit()
            
            print(f"✅ Admin user '{admin_username}' created successfully!")
            print(f"   Username: {admin_username}")
            print(f"   Email: {admin_email}")
            
    except Exception as e:
        print(f"⚠️  Error initializing admin user: {e}")
        # Don't fail startup if admin creation fails (might be DB not ready yet)
        import traceback
        traceback.print_exc()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(init_admin_user())

