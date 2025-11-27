"""
Public standings endpoints
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.team import GroupEnum
from app.services.standings import calculate_standings
from app.schemas.standings import TeamStandingResponse

router = APIRouter()


@router.get("/", response_model=List[TeamStandingResponse])
async def get_standings(
    group: Optional[GroupEnum] = Query(None, description="Filter by group (A or B), or all if not specified"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get league standings.
    
    Query parameters:
    - group: Filter by group (A or B), or return all groups if not specified
    """
    standings = await calculate_standings(db, group=group)
    return standings


@router.get("/teams/{team_id}", response_model=TeamStandingResponse)
async def get_team_standings(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Get standings for a specific team.
    """
    standings = await calculate_standings(db)
    
    team_standing = next((s for s in standings if s.team_id == team_id), None)
    
    if not team_standing:
        raise HTTPException(status_code=404, detail="Team standing not found")
    
    return team_standing


