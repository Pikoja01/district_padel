"""
Admin dashboard endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.team import Team, GroupEnum
from app.models.match import Match, MatchStatusEnum

router = APIRouter()


@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get dashboard statistics.
    """
    # Count active teams
    active_teams_query = select(func.count(Team.id)).where(Team.active == True)
    active_teams_result = await db.execute(active_teams_query)
    active_teams_count = active_teams_result.scalar_one()
    
    # Count total teams
    total_teams_query = select(func.count(Team.id))
    total_teams_result = await db.execute(total_teams_query)
    total_teams_count = total_teams_result.scalar_one()
    
    # Count matches by status
    scheduled_matches_query = select(func.count(Match.id)).where(
        Match.status == MatchStatusEnum.SCHEDULED
    )
    scheduled_result = await db.execute(scheduled_matches_query)
    scheduled_count = scheduled_result.scalar_one()
    
    played_matches_query = select(func.count(Match.id)).where(
        Match.status == MatchStatusEnum.PLAYED
    )
    played_result = await db.execute(played_matches_query)
    played_count = played_result.scalar_one()
    
    # Count teams by group
    group_a_query = select(func.count(Team.id)).where(
        and_(Team.group == GroupEnum.A, Team.active == True)
    )
    group_a_result = await db.execute(group_a_query)
    group_a_count = group_a_result.scalar_one()
    
    group_b_query = select(func.count(Team.id)).where(
        and_(Team.group == GroupEnum.B, Team.active == True)
    )
    group_b_result = await db.execute(group_b_query)
    group_b_count = group_b_result.scalar_one()
    
    return {
        "teams": {
            "active": active_teams_count,
            "total": total_teams_count,
            "group_a": group_a_count,
            "group_b": group_b_count,
        },
        "matches": {
            "scheduled": scheduled_count,
            "played": played_count,
            "total": scheduled_count + played_count,
        },
    }

