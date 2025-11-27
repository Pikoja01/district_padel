"""
Admin teams management endpoints
"""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.team import Team
from app.models.team_player import TeamPlayer, PlayerRoleEnum
from app.models.player import Player
from app.schemas.team import TeamCreate, TeamUpdate, TeamResponse, TeamPlayerCreate, TeamPlayerResponse
from app.services.team_service import validate_team_creation, archive_team, activate_team

router = APIRouter()


async def generate_team_name_from_players(players: List[TeamPlayerCreate], db: AsyncSession) -> str:
    """
    Generate team name from players' surnames.
    Takes the 2nd word (surname) from each player's name, extracts first 3 letters,
    converts to uppercase, and joins them with " | " separator.
    
    Example: "Marko Markovic", "Stefan Nikolic" -> "MAR | NIK"
    Example: "Marko Markovic", "Stefan Nikolic", "Luka Petrovic" -> "MAR | NIK | PET"
    """
    surnames = []
    
    for player_data in players:
        if player_data.name:
            # Get surname (2nd word) from player name
            name_parts = player_data.name.strip().split()
            if len(name_parts) >= 2:
                surname = name_parts[1]  # 2nd word is surname
                # Take first 3 letters, uppercase
                surname_code = surname[:3].upper()
                surnames.append(surname_code)
        elif player_data.player_id:
            # Fetch player from database to get name
            result = await db.execute(select(Player).where(Player.id == player_data.player_id))
            player = result.scalar_one_or_none()
            if player:
                name_parts = player.name.strip().split()
                if len(name_parts) >= 2:
                    surname = name_parts[1]
                    surname_code = surname[:3].upper()
                    surnames.append(surname_code)
    
    # Combine all surname codes with " | " separator
    return " | ".join(surnames) if surnames else "TEAM"


async def _process_team_players(
    db: AsyncSession,
    player_data_list: List[TeamPlayerCreate]
) -> List[tuple[UUID, PlayerRoleEnum]]:
    """
    Process team players: convert role strings to enums, create new players if needed,
    or use existing player IDs. Returns a list of (player_id, role_enum) tuples.
    """
    player_ids_to_use = []
    for player_data in player_data_list:
        # Convert role string to enum with explicit validation
        role_str = player_data.role.lower()
        if role_str == "main":
            role_enum = PlayerRoleEnum.MAIN
        elif role_str == "reserve":
            role_enum = PlayerRoleEnum.RESERVE
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid player role: {player_data.role}"
            )
        
        if player_data.name is not None:
            # Create a new player
            new_player = Player(name=player_data.name)
            db.add(new_player)
            await db.flush()
            player_ids_to_use.append((new_player.id, role_enum))
        else:
            # Use existing player ID
            player_ids_to_use.append((player_data.player_id, role_enum))
    
    return player_ids_to_use


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: TeamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new team.
    """
    # Validate team composition
    await validate_team_creation(team_data.players, db)
    
    # Generate team name if not provided
    team_name = team_data.name
    if not team_name or not team_name.strip():
        team_name = await generate_team_name_from_players(team_data.players, db)
    
    # Check if team name already exists
    existing_team = await db.execute(
        select(Team).where(Team.name == team_name)
    )
    if existing_team.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Team with name '{team_name}' already exists",
        )
    
    # Create team
    team = Team(
        name=team_name,
        group=team_data.group,
        active=True,
    )
    db.add(team)
    await db.flush()
    
    # Process players - create new ones if needed, or use existing IDs
    player_ids_to_use = await _process_team_players(db, team_data.players)
    
    # Create team-player relationships
    for player_id, role in player_ids_to_use:
        team_player = TeamPlayer(
            team_id=team.id,
            player_id=player_id,
            role=role,
        )
        db.add(team_player)
    
    await db.commit()
    
    # Reload team with relationships for response
    query = select(Team).where(Team.id == team.id).options(
        selectinload(Team.team_players).selectinload(TeamPlayer.player)
    )
    result = await db.execute(query)
    team = result.scalar_one()
    
    players = [
        TeamPlayerResponse(
            id=tp.player.id,
            name=tp.player.name,
            role=tp.role.value.lower()  # Convert "MAIN"/"RESERVE" to "main"/"reserve"
        )
        for tp in team.team_players
    ]
    
    return TeamResponse(
        id=team.id,
        name=team.name,
        group=team.group,
        active=team.active,
        players=players
    )


@router.get("/", response_model=List[TeamResponse])
async def list_teams(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all teams (including archived ones).
    """
    query = select(Team).options(
        selectinload(Team.team_players).selectinload(TeamPlayer.player)
    ).order_by(Team.name)
    
    result = await db.execute(query)
    teams = result.scalars().all()
    
    team_responses = []
    for team in teams:
        players = [
            TeamPlayerResponse(
                id=tp.player.id,
                name=tp.player.name,
                role=tp.role.value.lower()  # Convert "MAIN"/"RESERVE" to "main"/"reserve"
            )
            for tp in team.team_players
        ]
        
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
    current_user: User = Depends(get_current_user),
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
    
    players = [
        TeamPlayerResponse(
            id=tp.player.id,
            name=tp.player.name,
            role=tp.role.value.lower()  # Convert "MAIN"/"RESERVE" to "main"/"reserve"
        )
        for tp in team.team_players
    ]
    
    return TeamResponse(
        id=team.id,
        name=team.name,
        group=team.group,
        active=team.active,
        players=players
    )


@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(
    team_id: UUID,
    team_data: TeamUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update team information including players.
    """
    query = select(Team).where(Team.id == team_id).options(
        selectinload(Team.team_players).selectinload(TeamPlayer.player)
    )
    result = await db.execute(query)
    team = result.scalar_one_or_none()
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Update fields
    # Handle team name: if explicitly provided (even if empty), update it
    if team_data.name is not None:
        team_name = team_data.name.strip() if team_data.name else ""
        
        # If name is empty, generate from players
        if not team_name:
            # Use players from update if provided, otherwise use existing team players
            if team_data.players:
                team_name = await generate_team_name_from_players(team_data.players, db)
            else:
                # Use existing team players
                team_name = await generate_team_name_from_players(
                    [TeamPlayerCreate(name=tp.player.name, role=tp.role.value.lower()) 
                     for tp in team.team_players], 
                    db
                )
        
        # Check for conflicts with the new name
        existing = await db.execute(
            select(Team).where(Team.name == team_name, Team.id != team_id)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Team with name '{team_name}' already exists",
            )
        team.name = team_name
    
    if team_data.group is not None:
        team.group = team_data.group
    
    if team_data.active is not None:
        team.active = team_data.active
    
    # Update players if provided
    if team_data.players is not None:
        # Validate team composition
        await validate_team_creation(team_data.players, db)
        
        # Delete existing team-player relationships
        await db.execute(
            delete(TeamPlayer).where(TeamPlayer.team_id == team_id)
        )
        await db.flush()
        
        # Process new players - create new ones if needed, or use existing IDs
        player_ids_to_use = await _process_team_players(db, team_data.players)
        
        # Create new team-player relationships
        for player_id, role in player_ids_to_use:
            team_player = TeamPlayer(
                team_id=team.id,
                player_id=player_id,
                role=role,
            )
            db.add(team_player)
    
    await db.commit()
    
    # Reload team with relationships for response
    query = select(Team).where(Team.id == team.id).options(
        selectinload(Team.team_players).selectinload(TeamPlayer.player)
    )
    result = await db.execute(query)
    team = result.scalar_one()
    
    players = [
        TeamPlayerResponse(
            id=tp.player.id,
            name=tp.player.name,
            role=tp.role.value.lower()  # Convert "MAIN"/"RESERVE" to "main"/"reserve"
        )
        for tp in team.team_players
    ]
    
    return TeamResponse(
        id=team.id,
        name=team.name,
        group=team.group,
        active=team.active,
        players=players
    )


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Archive a team (soft delete).
    """
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()

    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    await archive_team(db, team_id)
    await db.commit()


@router.post("/{team_id}/activate", response_model=TeamResponse)
async def activate_team_endpoint(
    team_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Reactivate an archived team.
    """
    team = await activate_team(db, team_id)
    await db.flush()
    await db.refresh(team, ["team_players", "team_players.player"])
    await db.commit()
    
    players = [
        TeamPlayerResponse(
            id=tp.player.id,
            name=tp.player.name,
            role=tp.role.value.lower()  # Convert "MAIN"/"RESERVE" to "main"/"reserve"
        )
        for tp in team.team_players
    ]
    
    return TeamResponse(
        id=team.id,
        name=team.name,
        group=team.group,
        active=team.active,
        players=players
    )

