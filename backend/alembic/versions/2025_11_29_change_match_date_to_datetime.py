"""change_match_date_to_datetime

Revision ID: change_match_date_to_datetime
Revises: bf332b511a47
Create Date: 2025-11-29 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'change_match_date_to_datetime'
down_revision: Union[str, None] = 'bf332b511a47'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Change date column to timestamp (datetime)
    # PostgreSQL: ALTER TABLE matches ALTER COLUMN date TYPE TIMESTAMP USING date::timestamp;
    op.execute("ALTER TABLE matches ALTER COLUMN date TYPE TIMESTAMP USING date::timestamp")


def downgrade() -> None:
    # Change back to date (loses time information)
    op.execute("ALTER TABLE matches ALTER COLUMN date TYPE DATE USING date::date")


