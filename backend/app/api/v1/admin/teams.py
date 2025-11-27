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
    Create a team name from the players' surnames.
    
    For each entry in `players` this extracts the second word of the player's full name (surname) — using the provided `name` or fetching the Player by `player_id` from `db` if `name` is absent — takes the first three letters of that surname, converts them to uppercase, and joins the resulting codes with " | ". If no valid surnames are found, returns "TEAM".
    
    Parameters:
        players (List[TeamPlayerCreate]): Player descriptors; each may include `name` or `player_id`.
        db (AsyncSession): Database session used to load players when only `player_id` is provided.
    
    Returns:
        str: Generated team name (e.g., "MAR | NIK") or "TEAM" when no surname codes are available.
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
    Create or resolve players from the provided list and return their IDs paired with validated role enums.
    
    Processes each TeamPlayerCreate entry: converts the role string to a PlayerRoleEnum (raises HTTP 400 for invalid roles), creates a new Player when a name is provided (flushing to obtain its ID), or uses the given player_id otherwise.
    
    Returns:
        List[tuple[UUID, PlayerRoleEnum]]: A list of (player_id, role_enum) tuples for use when creating team-player relations.
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
    Create a new team, optionally generating a name from the provided players, creating any new Player records, linking players to the team, and persisting the team and relations.
    
    Parameters:
        team_data (TeamCreate): Data for the new team. If `name` is empty or blank, a name will be generated from the players' surnames. `players` may include new player names (which will create Player records) or existing `player_id` references.
    
    Returns:
        TeamResponse: The created team's data, including its id, name, group, active flag, and a list of players with their id, name, and role (`"main"` or `"reserve"`).
    
    Raises:
        HTTPException: Status 400 if a team with the resolved name already exists (or if validation performed by validate_team_creation fails).
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
    Update a team's fields and optionally replace its player roster.
    
    If `team_data.name` is provided: a non-empty trimmed value is applied; an empty string triggers automatic name generation from the provided players (or from the team's existing players if none are provided). If the resulting name conflicts with another team, the update is rejected. When `team_data.players` is provided, the team's player membership is replaced: the new composition is validated, existing team-player relations are removed, and new relations are created (new Player records are created as needed). The function commits changes and returns the updated team representation.
    
    Parameters:
        team_data (TeamUpdate): Update payload. Special behaviors:
            - If `name` is None, the team's name is left unchanged.
            - If `name` is the empty string (""), a name is generated from players.
            - If `players` is provided, it replaces the current roster after validation.
    
    Returns:
        TeamResponse: The updated team with its players and their roles (roles are lowercase strings).
    
    Raises:
        HTTPException: 404 if the team does not exist.
        HTTPException: 400 if the chosen/generated team name conflicts with an existing team or if team composition validation fails.
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
