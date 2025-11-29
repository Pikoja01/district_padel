"""
Match schemas for request/response validation
"""
from pydantic import BaseModel, field_validator
from uuid import UUID
from datetime import date, datetime
from typing import List, Optional
from app.models.team import GroupEnum
from app.models.match import MatchStatusEnum


class MatchSetCreate(BaseModel):
    """Schema for creating a match set"""
    set_number: int
    home_games: int
    away_games: int

    @field_validator("set_number")
    @classmethod
    def validate_set_number(cls, v: int) -> int:
        if v < 1 or v > 3:
            raise ValueError("Set number must be between 1 and 3")
        return v

    @field_validator("home_games", "away_games")
    @classmethod
    def validate_games(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Games cannot be negative")
        return v
    



class MatchBase(BaseModel):
    """Base match schema"""
    date: datetime
    group: GroupEnum
    round: Optional[str] = None
    home_team_id: UUID
    away_team_id: UUID


class MatchCreate(MatchBase):
    """Schema for creating/scheduling a match"""
    pass


class MatchResultCreate(BaseModel):
    """Schema for entering match results"""
    sets: List[MatchSetCreate]

    @field_validator("sets")
    @classmethod
    def validate_sets(cls, v: List[MatchSetCreate]) -> List[MatchSetCreate]:
        if len(v) < 1 or len(v) > 3:
            raise ValueError("Match must have between 1 and 3 sets")
        
        set_numbers = [s.set_number for s in v]
        if len(set_numbers) != len(set(set_numbers)):
            raise ValueError("Set numbers must be unique")
        
        if min(set_numbers) < 1 or max(set_numbers) > 3:
            raise ValueError("Set numbers must be between 1 and 3")
        
        # Validate that no set has both scores as 0
        for set_data in v:
            if set_data.home_games == 0 and set_data.away_games == 0:
                raise ValueError(f"Set {set_data.set_number} cannot have both scores as 0. At least one team must have scored.")
        
        return v


class MatchUpdate(BaseModel):
    """Schema for updating a match"""
    date: Optional[datetime] = None
    group: Optional[GroupEnum] = None
    round: Optional[str] = None
    home_team_id: Optional[UUID] = None
    away_team_id: Optional[UUID] = None


class MatchSetResponse(BaseModel):
    """Schema for match set response"""
    id: UUID
    set_number: int
    home_games: int
    away_games: int

    class Config:
        from_attributes = True


class MatchResponse(MatchBase):
    """Schema for match response"""
    id: UUID
    status: MatchStatusEnum
    match_sets: List[MatchSetResponse] = []
    home_team_name: Optional[str] = None
    away_team_name: Optional[str] = None

    class Config:
        from_attributes = True

