"""
Public matches endpoints
"""
from typing import List, Optional
from uuid import UUID
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.match import Match, MatchStatusEnum
from app.models.team import GroupEnum
from app.schemas.match import MatchResponse, MatchSetResponse

router = APIRouter()


@router.get("/", response_model=List[MatchResponse])
async def list_matches(
    group: Optional[GroupEnum] = Query(None, description="Filter by group (A or B)"),
    status: Optional[MatchStatusEnum] = Query(None, description="Filter by status"),
    date_from: Optional[date] = Query(None, description="Filter matches from this date"),
    date_to: Optional[date] = Query(None, description="Filter matches until this date"),
    db: AsyncSession = Depends(get_db),
):
    """
    List all matches.
    
    Query parameters:
    - group: Filter by group (A or B)
    - status: Filter by status (scheduled, played, cancelled)
    - date_from: Filter matches from this date
    - date_to: Filter matches until this date
    """
    query = select(Match).options(
        selectinload(Match.home_team),
        selectinload(Match.away_team),
        selectinload(Match.match_sets)
    )
    
    conditions = []
    if group:
        conditions.append(Match.group == group)
    if status:
        conditions.append(Match.status == status)
    if date_from:
        conditions.append(Match.date >= date_from)
    if date_to:
        conditions.append(Match.date <= date_to)
    
    if conditions:
        query = query.where(and_(*conditions))
    
    query = query.order_by(Match.date.desc())
    
    result = await db.execute(query)
    matches = result.scalars().all()
    
    # Convert to response format
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
            round=match.round,
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
        round=match.round,
        home_team_id=match.home_team_id,
        away_team_id=match.away_team_id,
        status=match.status,
        match_sets=match_sets,
        home_team_name=match.home_team.name if match.home_team else None,
        away_team_name=match.away_team.name if match.away_team else None,
    )


