"""
Custom validation utilities
"""
from typing import List
from app.schemas.team import TeamPlayerCreate
from app.schemas.match import MatchSetCreate


def validate_team_composition(players: List[TeamPlayerCreate]) -> None:
    """
    Validate team composition rules.
    
    Rules:
    - At least 2 players required
    - Maximum 3 players total
    - At least 2 must be "main" role
    - Maximum 1 "reserve" role
    """
    if len(players) < 2:
        raise ValueError("Team must have at least 2 players")
    if len(players) > 3:
        raise ValueError("Team cannot have more than 3 players")
    
    main_players = [p for p in players if p.role == "main"]
    reserve_players = [p for p in players if p.role == "reserve"]
    
    if len(main_players) < 2:
        raise ValueError("Team must have at least 2 main players")
    if len(reserve_players) > 1:
        raise ValueError("Team cannot have more than 1 reserve player")


def validate_match_result(sets: List[MatchSetCreate]) -> None:
    """
    Validate match result sets.
    
    Rules:
    - Between 1 and 3 sets
    - Set numbers must be unique
    - Set numbers must be between 1 and 3
    - Games must be non-negative
    """
    if len(sets) < 1 or len(sets) > 3:
        raise ValueError("Match must have between 1 and 3 sets")
    
    set_numbers = [s.set_number for s in sets]
    if len(set_numbers) != len(set(set_numbers)):
        raise ValueError("Set numbers must be unique")
    
    if min(set_numbers) < 1 or max(set_numbers) > 3:
        raise ValueError("Set numbers must be between 1 and 3")
    
    for match_set in sets:
        if match_set.home_games < 0 or match_set.away_games < 0:
            raise ValueError("Games cannot be negative")

