"""
Standings calculation service
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from uuid import UUID

from app.models.team import Team, GroupEnum
from app.models.match import Match, MatchStatusEnum
from app.schemas.standings import TeamStandingResponse
from app.services.match_service import count_sets_won


def calculate_match_points(team_sets_won: int, opponent_sets_won: int) -> int:
    """
    Calculate points for a team based on sets won in a match.
    
    Points system:
    - Win 2-0: 3 points
    - Win 2-1: 2 points
    - Lose 1-2: 1 point
    - Lose 0-2: 0 points
    
    Args:
        team_sets_won: Number of sets won by the team (0, 1, or 2)
        opponent_sets_won: Number of sets won by opponent (0, 1, or 2)
    
    Returns:
        Points awarded (0, 1, 2, or 3)
    """
    if team_sets_won == 2 and opponent_sets_won == 0:
        return 3  # Clean sweep win
    elif team_sets_won == 2 and opponent_sets_won == 1:
        return 2  # Win with 1 set lost
    elif team_sets_won == 1 and opponent_sets_won == 2:
        return 1  # Lost but won 1 set
    elif team_sets_won == 0 and opponent_sets_won == 2:
        return 0  # Clean sweep loss
    else:
        # Should not happen in best of 3 format, but handle edge case
        return 0


async def calculate_standings(
    db: AsyncSession,
    group: Optional[GroupEnum] = None
) -> List[TeamStandingResponse]:
    """
    Calculate league standings for all teams or filtered by group.
    
    Ranking rules:
    1. Points (descending)
    2. Matches Won (descending)
    3. Set Difference (descending)
    4. Game Difference (descending)
    5. Team Name (alphabetical)
    
    Args:
        db: Database session
        group: Optional group filter (A or B)
    
    Returns:
        List of team standings sorted by ranking
    """
    # Get all active teams
    query = select(Team).where(Team.active == True)
    if group:
        query = query.where(Team.group == group)
    
    teams_result = await db.execute(query)
    teams = teams_result.scalars().all()
    
    # Get all played matches with their sets
    matches_query = select(Match).where(
        Match.status == MatchStatusEnum.PLAYED
    ).options(selectinload(Match.match_sets))
    
    matches_result = await db.execute(matches_query)
    matches = matches_result.scalars().all()
    
    standings = []
    
    for team in teams:
        # Filter matches for this team
        team_matches = [
            m for m in matches
            if m.home_team_id == team.id or m.away_team_id == team.id
        ]
        
        matches_won = 0
        matches_lost = 0
        sets_for = 0
        sets_against = 0
        games_for = 0
        games_against = 0
        total_points = 0
        
        for match in team_matches:
            is_home = match.home_team_id == team.id
            
            # Calculate sets won for home and away
            home_sets_won, away_sets_won = count_sets_won(match.match_sets)
            team_sets_won = home_sets_won if is_home else away_sets_won
            opponent_sets_won = away_sets_won if is_home else home_sets_won
            
            # Track match wins/losses
            if team_sets_won > opponent_sets_won:
                matches_won += 1
            else:
                matches_lost += 1
            
            # Calculate points for this match
            match_points = calculate_match_points(team_sets_won, opponent_sets_won)
            total_points += match_points
            
            # Track sets
            sets_for += team_sets_won
            sets_against += opponent_sets_won
            
            # Calculate games
            for match_set in match.match_sets:
                if is_home:
                    games_for += match_set.home_games
                    games_against += match_set.away_games
                else:
                    games_for += match_set.away_games
                    games_against += match_set.home_games
        
        standings.append(TeamStandingResponse(
            team_id=team.id,
            team_name=team.name,
            group=team.group,
            matches_played=len(team_matches),
            matches_won=matches_won,
            matches_lost=matches_lost,
            sets_for=sets_for,
            sets_against=sets_against,
            games_for=games_for,
            games_against=games_against,
            points=total_points,
            set_diff=sets_for - sets_against,
            game_diff=games_for - games_against,
            position=0  # Will be set after sorting
        ))
    
    # Sort by ranking rules
    standings.sort(key=lambda s: (
        -s.points,              # Points descending
        -s.matches_won,         # Matches won descending
        -s.set_diff,            # Set difference descending
        -s.game_diff,           # Game difference descending
        s.team_name.lower()     # Team name ascending
    ))
    
    # Assign positions
    for i, standing in enumerate(standings):
        standing.position = i + 1
    
    return standings


