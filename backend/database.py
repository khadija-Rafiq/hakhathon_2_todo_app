from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set. Please configure your .env file.")

# Create engine with PostgreSQL-specific parameters for Neon
# If using psycopg scheme, convert to psycopg2 scheme to use psycopg2-binary
if "postgresql+psycopg://" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql+psycopg://", "postgresql+psycopg2://")
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

def create_db_and_tables():
    """Create database tables for all models"""
    # Import models to ensure they're registered with SQLModel metadata
    from models import User, Task, Conversation, Message
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency generator for database session"""
    with Session(engine) as session:
        yield session