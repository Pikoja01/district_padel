"""
Admin API router - combines all admin endpoints
"""
from fastapi import APIRouter

from app.api.v1.admin import auth, teams, players, matches, dashboard

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["admin-auth"])
router.include_router(teams.router, prefix="/teams", tags=["admin-teams"])
router.include_router(players.router, prefix="/players", tags=["admin-players"])
router.include_router(matches.router, prefix="/matches", tags=["admin-matches"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["admin-dashboard"])

