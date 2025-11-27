"""
Admin players management endpoints
"""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.player import Player
from app.models.team import Team
from app.models.team_player import TeamPlayer
from app.schemas.player import PlayerCreate, PlayerUpdate, PlayerResponse

router = APIRouter()


@router.post("/", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
async def create_player(
    player_data: PlayerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new player.
    """
    player = Player(
        name=player_data.name,
        email=player_data.email,
        phone=player_data.phone,
    )
    db.add(player)
    await db.commit()
    await db.refresh(player)
    
    return PlayerResponse(
        id=player.id,
        name=player.name,
        email=player.email,
        phone=player.phone,
    )


@router.get("/", response_model=List[PlayerResponse])
async def list_players(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all players.
    """
    query = select(Player).order_by(Player.name)
    result = await db.execute(query)
    players = result.scalars().all()
    
    return [
        PlayerResponse(
            id=p.id,
            name=p.name,
            email=p.email,
            phone=p.phone,
        )
        for p in players
    ]


@router.get("/{player_id}", response_model=PlayerResponse)
async def get_player(
    player_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get player details by ID.
    """
    query = select(Player).where(Player.id == player_id)
    result = await db.execute(query)
    player = result.scalar_one_or_none()
    
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    return PlayerResponse(
        id=player.id,
        name=player.name,
        email=player.email,
        phone=player.phone,
    )


@router.put("/{player_id}", response_model=PlayerResponse)
async def update_player(
    player_id: UUID,
    player_data: PlayerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update player information.
    """
    query = select(Player).where(Player.id == player_id)
    result = await db.execute(query)
    player = result.scalar_one_or_none()
    
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Update fields
    if player_data.name is not None:
        player.name = player_data.name
    if player_data.email is not None:
        player.email = player_data.email
    if player_data.phone is not None:
        player.phone = player_data.phone
    
    await db.commit()
    await db.refresh(player)
    
    return PlayerResponse(
        id=player.id,
        name=player.name,
        email=player.email,
        phone=player.phone,
    )


@router.get("/{player_id}/teams", response_model=List[dict])
async def get_player_teams(
    player_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all teams a player belongs to.
    """
    # Check if player exists
    query = select(Player).where(Player.id == player_id)
    result = await db.execute(query)
    player = result.scalar_one_or_none()
    
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Get all teams for this player
    query = select(TeamPlayer).where(TeamPlayer.player_id == player_id).options(
        selectinload(TeamPlayer.team)
    )
    result = await db.execute(query)
    team_players = result.scalars().all()
    
    return [
        {
            "team_id": str(tp.team.id),
            "team_name": tp.team.name,
            "group": tp.team.group.value,
            "role": tp.role.value,
            "active": tp.team.active,
        }
        for tp in team_players
    ]

