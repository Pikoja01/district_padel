"""
Authentication endpoints for admin
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from hmac import compare_digest

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserLogin, Token, UserResponse
from app.api.deps import get_current_user

router = APIRouter()
security = HTTPBearer()

_GENERIC_AUTH_ERROR_DETAIL = "Incorrect username or password"
# BCrypt hash for the string "unused-password" so timing stays consistent
_DUMMY_PASSWORD_HASH = "$2b$12$CjPrwftYadeuXLh5uqGZrupY41aJDyqzsc2ZU9SKtKSf38hwOx5kG"


def _constant_time_true(value: bool) -> bool:
    """Compare boolean results in constant time to reduce timing leaks."""
    return compare_digest(b"1" if value else b"0", b"1")


def _auth_failure() -> HTTPException:
    """Return a generic auth failure without leaking user state."""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=_GENERIC_AUTH_ERROR_DETAIL,
    )


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """
    Admin login endpoint.
    Returns JWT token for authenticated requests.
    """
    # Find user by username
    query = select(User).where(User.username == credentials.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    # Always perform password verification to keep timing uniform
    hashed_password = user.hashed_password if user else _DUMMY_PASSWORD_HASH
    password_valid = _constant_time_true(
        verify_password(credentials.password, hashed_password)
    )

    if not user or not user.is_active or not password_valid:
        raise _auth_failure()
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id), "username": user.username})
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    """
    Get current authenticated user information.
    """
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active,
    )

