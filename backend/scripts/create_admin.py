"""
Script to create initial admin user
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash


async def create_admin_user(username: str, email: str, password: str):
    """Create an admin user"""
    async with AsyncSessionLocal() as session:
        # Check if user already exists
        from sqlalchemy import select
        query = select(User).where(
            (User.username == username) | (User.email == email)
        )
        result = await session.execute(query)
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print(f"User with username '{username}' or email '{email}' already exists!")
            return
        
        # Create new user
        hashed_password = get_password_hash(password)
        admin_user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            is_active=True,
        )
        
        session.add(admin_user)
        await session.commit()
        await session.refresh(admin_user)
        
        print(f"✅ Admin user created successfully!")
        print(f"   Username: {admin_user.username}")
        print(f"   Email: {admin_user.email}")
        print(f"   ID: {admin_user.id}")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python scripts/create_admin.py <username> <email> <password>")
        print("\nExample:")
        print("  python scripts/create_admin.py admin admin@districtpadel.rs admin123")
        sys.exit(1)
    
    username = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    
    asyncio.run(create_admin_user(username, email, password))

