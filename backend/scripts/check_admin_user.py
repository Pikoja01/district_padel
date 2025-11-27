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


async def check_admin_user(username: str = "admin"):
    """Check admin user details"""
    async with AsyncSessionLocal() as session:
        # Find the admin user by username (defaults to 'admin')
        query = select(User).where(User.username == username)
        result = await session.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            print(f"No admin user found for username '{username}'!")
            return

        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Is Active: {user.is_active}")
        print(f"ID: {user.id}")
        print("-" * 50)


if __name__ == "__main__":
    username = sys.argv[1] if len(sys.argv) > 1 else "admin"
    asyncio.run(check_admin_user(username))


