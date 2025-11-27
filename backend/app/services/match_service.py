"""
Match service for processing match results
"""
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.match import Match, MatchSet, MatchStatusEnum
from app.schemas.match import MatchResultCreate, MatchSetCreate


def count_sets_won(match_sets: list[MatchSet]) -> tuple[int, int]:
    """
    Count how many sets the home and away teams have won.
    """
    home_sets_won = 0
    away_sets_won = 0

    for match_set in sorted(match_sets, key=lambda x: x.set_number):
        if match_set.home_games > match_set.away_games:
            home_sets_won += 1
        elif match_set.away_games > match_set.home_games:
            away_sets_won += 1

    return home_sets_won, away_sets_won


async def enter_match_result(
    db: AsyncSession,
    match_id: UUID,
    result: MatchResultCreate
) -> Match:
    """
    Enter match result and calculate winner.
    
    Args:
        db: Database session
        match_id: ID of the match
        result: Match result with sets
    
    Returns:
        Updated match object
    """
    # Get match with existing sets
    query = select(Match).where(Match.id == match_id).options(
        selectinload(Match.match_sets)
    )
    result_query = await db.execute(query)
    match = result_query.scalar_one_or_none()
    
    if not match:
        raise ValueError(f"Match {match_id} not found")
    
    # Allow updating results if match is scheduled or in progress
    if match.status not in [MatchStatusEnum.SCHEDULED, MatchStatusEnum.IN_PROGRESS]:
        raise ValueError(f"Match {match_id} cannot be updated (status: {match.status})")
    
    # Validate that no sets have empty/zero scores for both teams
    for set_data in result.sets:
        if set_data.home_games == 0 and set_data.away_games == 0:
            raise ValueError(f"Set {set_data.set_number} cannot have both scores as 0")
    
    # Delete existing sets if any
    for existing_set in match.match_sets:
        await db.delete(existing_set)    
    # Create new match sets
    for set_data in result.sets:
        match_set = MatchSet(
            match_id=match.id,
            set_number=set_data.set_number,
            home_games=set_data.home_games,
            away_games=set_data.away_games,
        )
        db.add(match_set)
    
    # Determine match status based on whether there's a winner
    await db.flush()
    await db.refresh(match, ["match_sets"])
    
    # Determine match status based on winner
    winner_id = determine_match_winner(match)
    if winner_id:
        match.status = MatchStatusEnum.PLAYED
    else:
        match.status = MatchStatusEnum.IN_PROGRESS
    
    return match


def determine_match_winner(match: Match) -> UUID | None:
    """
    Determine the winner of a match based on sets won.
    
    Args:
        match: Match object with match_sets loaded
    
    Returns:
        UUID of winning team, or None if match not completed
    """
    if not match.match_sets:
        return None
    
    home_sets_won, away_sets_won = count_sets_won(match.match_sets)
    
    if home_sets_won > away_sets_won:
        return match.home_team_id
    elif away_sets_won > home_sets_won:
        return match.away_team_id
    else:
        return None

