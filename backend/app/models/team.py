"""
Team model
"""
from sqlalchemy import Column, String, Boolean, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class GroupEnum(str, enum.Enum):
    """Team group enumeration"""
    A = "A"
    B = "B"


class Team(Base):
    """Team model"""
    __tablename__ = "teams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False, index=True)
    group = Column(SQLEnum(GroupEnum), nullable=False, index=True)
    active = Column(Boolean, default=True, nullable=False, index=True)

    # Relationships
    team_players = relationship("TeamPlayer", back_populates="team", cascade="all, delete-orphan")
    home_matches = relationship("Match", foreign_keys="Match.home_team_id", back_populates="home_team")
    away_matches = relationship("Match", foreign_keys="Match.away_team_id", back_populates="away_team")

    def __repr__(self):
        return f"<Team {self.name} (Group {self.group.value})>"


