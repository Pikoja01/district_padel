"""
Public API router - combines all public endpoints
"""
from fastapi import APIRouter

from app.api.v1.public import teams, matches, standings

router = APIRouter()

router.include_router(teams.router, prefix="/teams", tags=["teams"])
router.include_router(matches.router, prefix="/matches", tags=["matches"])
router.include_router(standings.router, prefix="/standings", tags=["standings"])


