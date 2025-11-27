"""
Public teams endpoints
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.team import Team, GroupEnum
from app.models.player import Player
from app.models.team_player import TeamPlayer
from app.schemas.team import TeamResponse, TeamPlayerResponse

router = APIRouter()


@router.get("/", response_model=List[TeamResponse])
async def list_teams(
    group: Optional[GroupEnum] = Query(None, description="Filter by group (A or B)"),
    active: Optional[bool] = Query(True, description="Filter by active status"),
    db: AsyncSession = Depends(get_db),
):
    """
    List all teams.
    
    Query parameters:
    - group: Filter by group (A or B)
    - active: Filter by active status (default: true)
    """
    query = select(Team).options(
        selectinload(Team.team_players).selectinload(TeamPlayer.player)
    )
    
    conditions = []
    if active is not None:
        conditions.append(Team.active == active)
    if group:
        conditions.append(Team.group == group)
    
    if conditions:
        query = query.where(and_(*conditions))
    
    result = await db.execute(query)
    teams = result.scalars().all()
    
    # Convert to response format
    team_responses = []
    for team in teams:
        players = []
        for team_player in team.team_players:
            players.append(TeamPlayerResponse(
                id=team_player.player.id,
                name=team_player.player.name,
                role=team_player.role.value
            ))
        
        team_responses.append(TeamResponse(
            id=team.id,
            name=team.name,
            group=team.group,
            active=team.active,
            players=players
        ))
    
    return team_responses


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Get team details by ID.
    """
    query = select(Team).where(Team.id == team_id).options(
        selectinload(Team.team_players).selectinload(TeamPlayer.player)
    )
    
    result = await db.execute(query)
    team = result.scalar_one_or_none()
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Convert to response format
    players = []
    for team_player in team.team_players:
        players.append(TeamPlayerResponse(
            id=team_player.player.id,
            name=team_player.player.name,
            role=team_player.role.value
        ))
    
    return TeamResponse(
        id=team.id,
        name=team.name,
        group=team.group,
        active=team.active,
        players=players
    )


