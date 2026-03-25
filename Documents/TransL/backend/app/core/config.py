import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Team Rocket - Smart Load Matching"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./logistics.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "team-rocket-secret-key-change-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()