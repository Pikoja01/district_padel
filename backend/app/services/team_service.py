"""
Team service for team management logic
"""
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.team import Team
from app.models.team_player import TeamPlayer
from app.schemas.team import TeamPlayerCreate
from app.utils.validators import validate_team_composition


async def validate_team_creation(
    players: list[TeamPlayerCreate],
    db: AsyncSession
) -> None:
    """
    Validate team creation rules.
    
    Rules:
    - At least 2 players required
    - Maximum 3 players total
    - At least 2 must be "main" role
    - Maximum 1 "reserve" role
    - All player IDs must exist (if provided)
    
    Args:
        players: List of team players to validate
        db: Database session
    
    Raises:
        ValueError: If validation fails
    """
    # Use the validator from utils (for role composition)
    validate_team_composition(players)
    
    # Check all player IDs exist (only for players that have player_id)
    player_ids = [p.player_id for p in players if p.player_id is not None]
    if player_ids:
        from app.models.player import Player
        query = select(Player).where(Player.id.in_(player_ids))
        result = await db.execute(query)
        existing_players = result.scalars().all()
        existing_ids = {p.id for p in existing_players}
        
        missing_ids = set(player_ids) - existing_ids
        if missing_ids:
            raise ValueError(f"Players not found: {missing_ids}")
        
        # Check for duplicate player IDs in the same team
        if len(player_ids) != len(set(player_ids)):
            raise ValueError("Duplicate player IDs in team")


async def archive_team(
    db: AsyncSession,
    team_id: UUID
) -> Team:
    """
    Archive a team (soft delete).
    
    Args:
        db: Database session
        team_id: ID of team to archive
    
    Returns:
        Updated team object
    """
    query = select(Team).where(Team.id == team_id)
    result = await db.execute(query)
    team = result.scalar_one_or_none()
    
    if not team:
        raise ValueError(f"Team {team_id} not found")
    
    team.active = False
    await db.flush()
    await db.refresh(team)
    
    return team


async def activate_team(
    db: AsyncSession,
    team_id: UUID
) -> Team:
    """
    Activate an archived team.
    
    Args:
        db: Database session
        team_id: ID of team to activate
    
    Returns:
        Updated team object
    """
    query = select(Team).where(Team.id == team_id)
    result = await db.execute(query)
    team = result.scalar_one_or_none()
    
    if not team:
        raise ValueError(f"Team {team_id} not found")
    
    team.active = True
    await db.flush()
    await db.refresh(team)
    
    return team

