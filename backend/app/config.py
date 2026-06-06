from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str = "postgresql://escola:senha@postgres:5432/escoladb"
    secret_key: str = "changeme"
    environment: str = "production"
    cors_origins: List[str] = ["*"]

    class Config:
        env_file = ".env"


settings = Settings()
