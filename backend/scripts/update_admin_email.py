"""
Script to update admin user email
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select, update
from app.core.database import AsyncSessionLocal
from app.models.user import User


async def update_admin_email():
    """Update admin user username and email to admin@test.com"""
    async with AsyncSessionLocal() as session:
        # Find admin user
        query = select(User).where(User.username == "admin@test")
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        
        if not user:
            print("Admin user not found!")
            return
        
        # Update both username and email to admin@test.com
        user.username = "admin@test.com"
        user.email = "admin@test.com"
        session.add(user)
        await session.commit()
        await session.refresh(user)
        
        print(f"Successfully updated admin user:")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Is Active: {user.is_active}")


if __name__ == "__main__":
    asyncio.run(update_admin_email())

