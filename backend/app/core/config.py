"""
Application configuration management
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List
import re


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str
    DB_PASSWORD: str  # Required: must be provided via environment variable or .env file
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def ensure_asyncpg_driver(cls, v: str) -> str:
        """Ensure DATABASE_URL uses asyncpg driver for async SQLAlchemy"""
        if isinstance(v, str) and v.startswith("postgresql://") and "+asyncpg" not in v:
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    
    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def validate_database_url_format(cls, v: str) -> str:
        """
        Validate DATABASE_URL format matches PostgreSQL connection string pattern.
        
        Expected format: postgresql[+asyncpg]://user:password@host:port/database
        """
        if not isinstance(v, str) or not v.strip():
            raise ValueError(
                "DATABASE_URL is missing or empty. "
                "Please set DATABASE_URL environment variable. "
                "See backend/docs/DEPLOYMENT.md for setup instructions."
            )
        
        # Pattern for PostgreSQL URL: postgresql[+driver]://user:password@host:port/dbname
        # Allows for special characters in password via URL encoding
        postgresql_pattern = r'^postgresql(\+[a-zA-Z0-9]+)?://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)(\?.*)?$'
        
        if not re.match(postgresql_pattern, v):
            raise ValueError(
                f"DATABASE_URL has invalid format. "
                f"Expected format: postgresql[+asyncpg]://user:password@host:port/database\n"
                f"Received: {v[:50]}... (truncated for security)\n"
                f"See backend/docs/DEPLOYMENT.md for correct format and setup instructions."
            )
        
        return v
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "District Padel Backend"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173"
    CORS_ALLOW_METHODS: str = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    CORS_ALLOW_HEADERS: str = "Authorization,Content-Type"
    CORS_EXPOSE_HEADERS: str = ""
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    def _csv_to_list(self, value: str) -> List[str]:
        """Convert comma-separated environment values into trimmed lists"""
        if not value:
            return []
        return [item.strip() for item in value.split(",") if item.strip()]

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return self._csv_to_list(self.CORS_ORIGINS)

    @property
    def cors_allow_methods_list(self) -> List[str]:
        """HTTP methods allowed by CORS"""
        return self._csv_to_list(self.CORS_ALLOW_METHODS)

    @property
    def cors_allow_headers_list(self) -> List[str]:
        """Headers accepted by CORS"""
        return self._csv_to_list(self.CORS_ALLOW_HEADERS)

    @property
    def cors_expose_headers_list(self) -> List[str]:
        """Headers exposed to the browser"""
        return self._csv_to_list(self.CORS_EXPOSE_HEADERS)
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
    }

# Create global settings instance
settings = Settings()


