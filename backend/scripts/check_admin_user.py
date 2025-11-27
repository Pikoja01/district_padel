"""
Script to check admin user details
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.user import User


async def check_admin_user():
    """Check admin user details"""
    async with AsyncSessionLocal() as session:
        # Find all admin users
        query = select(User)
        result = await session.execute(query)
        users = result.scalars().all()
        
        if not users:
            print("No users found!")
            return
        
        for user in users:
            print(f"Username: {user.username}")
            print(f"Email: {user.email}")
            print(f"Is Active: {user.is_active}")
            print(f"ID: {user.id}")
            print("-" * 50)


if __name__ == "__main__":
    asyncio.run(check_admin_user())

