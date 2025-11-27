"""
Pydantic schemas for request/response validation
"""
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
from app.schemas.player import PlayerCreate, PlayerUpdate, PlayerResponse
from app.schemas.team import TeamCreate, TeamUpdate, TeamResponse, TeamPlayerCreate, TeamPlayerResponse
from app.schemas.match import (
    MatchCreate,
    MatchUpdate,
    MatchResponse,
    MatchResultCreate,
    MatchSetCreate,
    MatchSetResponse,
)
from app.schemas.standings import TeamStandingResponse

__all__ = [
    # User schemas
    "UserCreate",
    "UserResponse",
    "UserLogin",
    "Token",
    # Player schemas
    "PlayerCreate",
    "PlayerUpdate",
    "PlayerResponse",
    # Team schemas
    "TeamCreate",
    "TeamUpdate",
    "TeamResponse",
    "TeamPlayerCreate",
    "TeamPlayerResponse",
    # Match schemas
    "MatchCreate",
    "MatchUpdate",
    "MatchResponse",
    "MatchResultCreate",
    "MatchSetCreate",
    "MatchSetResponse",
    # Standings schemas
    "TeamStandingResponse",
]
