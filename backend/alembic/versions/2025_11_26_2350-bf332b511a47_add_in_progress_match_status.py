"""add_in_progress_match_status

Revision ID: bf332b511a47
Revises: fce71ed3aecc
Create Date: 2025-11-26 23:50:37.208492

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bf332b511a47'
down_revision: Union[str, None] = 'fce71ed3aecc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add IN_PROGRESS to the MatchStatusEnum
    op.execute("ALTER TYPE matchstatusenum ADD VALUE IF NOT EXISTS 'IN_PROGRESS'")


def downgrade() -> None:
    # Note: PostgreSQL doesn't support removing enum values directly
    # This would require recreating the enum type, which is complex
    # For now, we'll leave it as a no-op and document that manual intervention may be needed
    # In production, consider keeping IN_PROGRESS or using a data migration
    pass
