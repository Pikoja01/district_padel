"""
TeamPlayer junction table - links players to teams with roles
"""
from sqlalchemy import Column, ForeignKey, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class PlayerRoleEnum(str, enum.Enum):
    """Player role enumeration"""
    MAIN = "main"
    RESERVE = "reserve"


class TeamPlayer(Base):
    """Junction table linking teams and players with roles"""
    __tablename__ = "team_players"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    role = Column(SQLEnum(PlayerRoleEnum), nullable=False)

    # Relationships
    team = relationship("Team", back_populates="team_players")
    player = relationship("Player", back_populates="team_players")

    # Constraints
    __table_args__ = (
        UniqueConstraint("team_id", "player_id", name="unique_team_player"),
    )

    def __repr__(self):
        return f"<TeamPlayer {self.player_id} in {self.team_id} as {self.role.value}>"

