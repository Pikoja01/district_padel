"""
Admin matches management endpoints
"""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.match import Match, MatchStatusEnum
from app.models.team import Team, GroupEnum
from app.schemas.match import MatchCreate, MatchUpdate, MatchResponse, MatchResultCreate, MatchSetResponse
from app.services.match_service import enter_match_result
from app.exceptions import NotFoundError

router = APIRouter()


@router.post("/", response_model=MatchResponse, status_code=status.HTTP_201_CREATED)
async def create_match(
    match_data: MatchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Schedule a new match.
    """
    # Validate teams are different
    if match_data.home_team_id == match_data.away_team_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Home team and away team must be different",
        )
    
    # Validate teams exist and are in the same group
    home_team_query = select(Team).where(Team.id == match_data.home_team_id)
    away_team_query = select(Team).where(Team.id == match_data.away_team_id)
    
    home_result = await db.execute(home_team_query)
    away_result = await db.execute(away_team_query)
    
    home_team = home_result.scalar_one_or_none()
    away_team = away_result.scalar_one_or_none()
    
    if not home_team:
        raise HTTPException(status_code=404, detail="Home team not found")
    if not away_team:
        raise HTTPException(status_code=404, detail="Away team not found")
    
    if home_team.group != match_data.group or away_team.group != match_data.group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both teams must be in the same group as the match",
        )
    
    # Create match
    match = Match(
        date=match_data.date,
        group=match_data.group,
        home_team_id=match_data.home_team_id,
        away_team_id=match_data.away_team_id,
        status=MatchStatusEnum.SCHEDULED,
    )
    db.add(match)
    await db.commit()
    await db.refresh(match, ["home_team", "away_team", "match_sets"])
    
    return MatchResponse(
        id=match.id,
        date=match.date,
        group=match.group,
        home_team_id=match.home_team_id,
        away_team_id=match.away_team_id,
        status=match.status,
        match_sets=[],
        home_team_name=match.home_team.name if match.home_team else None,
        away_team_name=match.away_team.name if match.away_team else None,
    )


@router.get("/", response_model=List[MatchResponse])
async def list_matches(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all matches.
    """
    query = select(Match).options(
        selectinload(Match.home_team),
        selectinload(Match.away_team),
        selectinload(Match.match_sets)
    ).order_by(Match.date.desc())
    
    result = await db.execute(query)
    matches = result.scalars().all()
    
    match_responses = []
    for match in matches:
        match_sets = [
            MatchSetResponse(
                id=ms.id,
                set_number=ms.set_number,
                home_games=ms.home_games,
                away_games=ms.away_games
            )
            for ms in sorted(match.match_sets, key=lambda x: x.set_number)
        ]
        
        match_responses.append(MatchResponse(
            id=match.id,
            date=match.date,
            group=match.group,
            home_team_id=match.home_team_id,
            away_team_id=match.away_team_id,
            status=match.status,
            match_sets=match_sets,
            home_team_name=match.home_team.name if match.home_team else None,
            away_team_name=match.away_team.name if match.away_team else None,
        ))
    
    return match_responses


@router.get("/{match_id}", response_model=MatchResponse)
async def get_match(
    match_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get match details by ID.
    """
    query = select(Match).where(Match.id == match_id).options(
        selectinload(Match.home_team),
        selectinload(Match.away_team),
        selectinload(Match.match_sets)
    )
    
    result = await db.execute(query)
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    match_sets = [
        MatchSetResponse(
            id=ms.id,
            set_number=ms.set_number,
            home_games=ms.home_games,
            away_games=ms.away_games
        )
        for ms in sorted(match.match_sets, key=lambda x: x.set_number)
    ]
    
    return MatchResponse(
        id=match.id,
        date=match.date,
        group=match.group,
        home_team_id=match.home_team_id,
        away_team_id=match.away_team_id,
        status=match.status,
        match_sets=match_sets,
        home_team_name=match.home_team.name if match.home_team else None,
        away_team_name=match.away_team.name if match.away_team else None,
    )


@router.put("/{match_id}", response_model=MatchResponse)
async def update_match(
    match_id: UUID,
    match_data: MatchUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update match information (date, teams, etc.).
    Cannot update if match is already played.
    """
    query = select(Match).where(Match.id == match_id).options(
        selectinload(Match.home_team),
        selectinload(Match.away_team),
        selectinload(Match.match_sets)
    )
    result = await db.execute(query)
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Allow updating played matches to fix errors
    # Status will be recalculated based on sets won
    
    # Update fields
    if match_data.date is not None:
        match.date = match_data.date
    if match_data.group is not None:
        match.group = match_data.group
    if match_data.home_team_id is not None:
        match.home_team_id = match_data.home_team_id
    if match_data.away_team_id is not None:
        match.away_team_id = match_data.away_team_id
    
    # Validate teams are different after any update
    if match.home_team_id == match.away_team_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Home team and away team must be different",
        )

    # Re-validate team groups if group or teams changed
    if match_data.group is not None or match_data.home_team_id is not None or match_data.away_team_id is not None:
        home_result = await db.execute(select(Team).where(Team.id == match.home_team_id))
        away_result = await db.execute(select(Team).where(Team.id == match.away_team_id))
        home_team = home_result.scalar_one_or_none()
        away_team = away_result.scalar_one_or_none()
        
        if not home_team or not away_team:
            raise HTTPException(status_code=404, detail="Team not found")
        
        if home_team.group != match.group or away_team.group != match.group:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both teams must be in the same group as the match",
            )
    
    await db.commit()
    await db.refresh(match, ["home_team", "away_team", "match_sets"])
    
    match_sets = [
        MatchSetResponse(
            id=ms.id,
            set_number=ms.set_number,
            home_games=ms.home_games,
            away_games=ms.away_games
        )
        for ms in sorted(match.match_sets, key=lambda x: x.set_number)
    ]
    
    return MatchResponse(
        id=match.id,
        date=match.date,
        group=match.group,
        home_team_id=match.home_team_id,
        away_team_id=match.away_team_id,
        status=match.status,
        match_sets=match_sets,
        home_team_name=match.home_team.name if match.home_team else None,
        away_team_name=match.away_team.name if match.away_team else None,
    )


@router.post("/{match_id}/result", response_model=MatchResponse)
async def enter_match_result_endpoint(
    match_id: UUID,
    result: MatchResultCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Enter match result after the match has been played.
    """
    try:
        match = await enter_match_result(db, match_id, result)
        await db.commit()
        await db.refresh(match, ["home_team", "away_team", "match_sets"])
        
        match_sets = [
            MatchSetResponse(
                id=ms.id,
                set_number=ms.set_number,
                home_games=ms.home_games,
                away_games=ms.away_games
            )
            for ms in sorted(match.match_sets, key=lambda x: x.set_number)
        ]
        
        return MatchResponse(
            id=match.id,
            date=match.date,
            group=match.group,
            home_team_id=match.home_team_id,
            away_team_id=match.away_team_id,
            status=match.status,
            match_sets=match_sets,
            home_team_name=match.home_team.name if match.home_team else None,
            away_team_name=match.away_team.name if match.away_team else None,
        )
    except NotFoundError as e:
        await db.rollback()
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ValueError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e)) from e

@router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_match(
    match_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Cancel/delete a match.
    Only allowed if match is not played (scheduled, in_progress, or cancelled).
    """
    query = select(Match).where(Match.id == match_id)
    result = await db.execute(query)
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Allow deletion of any match, including played ones
    await db.delete(match)
    await db.commit()

