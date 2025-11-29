"""add_round_to_matches

Revision ID: add_round_to_matches
Revises: change_match_date_to_datetime
Create Date: 2025-11-29 13:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'add_round_to_matches'
down_revision: Union[str, None] = 'change_match_date_to_datetime'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add round column to matches table
    op.add_column('matches', sa.Column('round', sa.String(length=50), nullable=True))
    op.create_index(op.f('ix_matches_round'), 'matches', ['round'], unique=False)


def downgrade() -> None:
    # Remove round column
    op.drop_index(op.f('ix_matches_round'), table_name='matches')
    op.drop_column('matches', 'round')


