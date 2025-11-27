"""
Player schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional


class PlayerBase(BaseModel):
    """Base player schema"""
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class PlayerCreate(PlayerBase):
    """Schema for creating a player"""
    pass


class PlayerUpdate(BaseModel):
    """Schema for updating a player"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class PlayerResponse(PlayerBase):
    """Schema for player response"""
    id: UUID

    class Config:
        from_attributes = True


