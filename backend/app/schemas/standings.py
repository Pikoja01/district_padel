"""
Standings schemas for response validation
"""
from pydantic import BaseModel
from uuid import UUID
from app.models.team import GroupEnum


class TeamStandingResponse(BaseModel):
    """Schema for team standing in league table"""
    team_id: UUID
    team_name: str
    group: GroupEnum
    matches_played: int
    matches_won: int
    matches_lost: int
    sets_for: int
    sets_against: int
    games_for: int
    games_against: int
    points: int
    set_diff: int
    game_diff: int
    position: int

    class Config:
        from_attributes = True


