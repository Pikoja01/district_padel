"""
Team schemas for request/response validation
"""
from pydantic import BaseModel, field_validator, model_validator
from uuid import UUID
from typing import List, Optional
from app.models.team import GroupEnum


class TeamPlayerCreate(BaseModel):
    """Schema for adding a player to a team.
    
    You can either:
    - Provide player_id to reference an existing player
    - Provide name + role to create a new player automatically
    """
    player_id: Optional[UUID] = None
    name: Optional[str] = None
    role: str  # "main" or "reserve"

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ["main", "reserve"]:
            raise ValueError("Role must be 'main' or 'reserve'")
        return v
    
    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError("Player name cannot be empty")
            if len(v) > 100:
                raise ValueError("Player name cannot exceed 100 characters")
        return v
    
    @model_validator(mode='after')
    def validate_player_reference(self):
        """Validate that either player_id or name is provided, but not both"""
        if self.player_id is None and self.name is None:
            raise ValueError("Either 'player_id' or 'name' must be provided")
        if self.player_id is not None and self.name is not None:
            raise ValueError("Cannot provide both 'player_id' and 'name'. Use one or the other.")
        return self


class TeamBase(BaseModel):
    """Base team schema"""
    name: Optional[str] = None
    group: GroupEnum


class TeamCreate(TeamBase):
    """Schema for creating a team"""
    players: List[TeamPlayerCreate]

    @field_validator("players")
    @classmethod
    def validate_players(cls, v: List[TeamPlayerCreate]) -> List[TeamPlayerCreate]:
        if len(v) < 2:
            raise ValueError("Team must have at least 2 players")
        if len(v) > 3:
            raise ValueError("Team cannot have more than 3 players")
        
        main_players = [p for p in v if p.role == "main"]
        reserve_players = [p for p in v if p.role == "reserve"]
        
        if len(main_players) < 2:
            raise ValueError("Team must have at least 2 main players")
        if len(reserve_players) > 1:
            raise ValueError("Team cannot have more than 1 reserve player")
        
        return v


class TeamUpdate(BaseModel):
    """Schema for updating a team"""
    name: Optional[str] = None
    group: Optional[GroupEnum] = None
    active: Optional[bool] = None
    players: Optional[List[TeamPlayerCreate]] = None

    @field_validator("players")
    @classmethod
    def validate_players(cls, v: Optional[List[TeamPlayerCreate]]) -> Optional[List[TeamPlayerCreate]]:
        if v is None:
            return v
        if len(v) < 2:
            raise ValueError("Team must have at least 2 players")
        if len(v) > 3:
            raise ValueError("Team cannot have more than 3 players")
        
        main_players = [p for p in v if p.role == "main"]
        reserve_players = [p for p in v if p.role == "reserve"]
        
        if len(main_players) < 2:
            raise ValueError("Team must have at least 2 main players")
        if len(reserve_players) > 1:
            raise ValueError("Team cannot have more than 1 reserve player")
        
        return v


class TeamPlayerResponse(BaseModel):
    """Schema for team player in response"""
    id: UUID
    name: str
    role: str

    class Config:
        from_attributes = True


class TeamResponse(TeamBase):
    """Schema for team response"""
    id: UUID
    active: bool
    players: List[TeamPlayerResponse] = []

    class Config:
        from_attributes = True

