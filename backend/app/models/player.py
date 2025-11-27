"""
Player model
"""
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base


class Player(Base):
    """Player model - can belong to multiple teams"""
    __tablename__ = "players"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, index=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)

    # Relationships
    team_players = relationship("TeamPlayer", back_populates="player", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Player {self.name}>"

