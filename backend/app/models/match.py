"""
Match and MatchSet models
"""
from sqlalchemy import Column, Date, ForeignKey, Integer, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class GroupEnum(str, enum.Enum):
    """Match group enumeration"""
    A = "A"
    B = "B"


class MatchStatusEnum(str, enum.Enum):
    """Match status enumeration"""
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"  # Match has started but not finished
    PLAYED = "played"  # Match completed with a winner
    CANCELLED = "cancelled"


class Match(Base):
    """Match model"""
    __tablename__ = "matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, nullable=False, index=True)
    group = Column(SQLEnum(GroupEnum), nullable=False, index=True)
    home_team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    away_team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    status = Column(SQLEnum(MatchStatusEnum), default=MatchStatusEnum.SCHEDULED, nullable=False, index=True)

    # Relationships
    home_team = relationship("Team", foreign_keys=[home_team_id], back_populates="home_matches")
    away_team = relationship("Team", foreign_keys=[away_team_id], back_populates="away_matches")
    match_sets = relationship("MatchSet", back_populates="match", cascade="all, delete-orphan", order_by="MatchSet.set_number")

    # Constraints
    __table_args__ = (
        CheckConstraint("home_team_id != away_team_id", name="check_different_teams"),
    )

    def __repr__(self):
        return f"<Match {self.date} - Group {self.group.value}>"


class MatchSet(Base):
    """Individual set in a match"""
    __tablename__ = "match_sets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    set_number = Column(Integer, nullable=False)  # 1, 2, or 3
    home_games = Column(Integer, nullable=False)
    away_games = Column(Integer, nullable=False)

    # Relationships
    match = relationship("Match", back_populates="match_sets")

    # Constraints
    __table_args__ = (
        CheckConstraint("set_number >= 1 AND set_number <= 3", name="check_set_number_range"),
    )

    def __repr__(self):
        return f"<MatchSet {self.set_number}: {self.home_games}-{self.away_games}>"

