from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    # Add new columns if they don't exist
    try:
        conn.execute(text("ALTER TABLE task ADD COLUMN priority VARCHAR(20) DEFAULT 'Medium'"))
        conn.commit()
        print("Added priority column")
    except Exception as e:
        print(f"Priority column exists or error: {e}")
    
    try:
        conn.execute(text("ALTER TABLE task ADD COLUMN category VARCHAR(50) DEFAULT 'Personal'"))
        conn.commit()
        print("Added category column")
    except Exception as e:
        print(f"Category column exists or error: {e}")
    
    try:
        conn.execute(text("ALTER TABLE task ADD COLUMN due_date TIMESTAMP"))
        conn.commit()
        print("Added due_date column")
    except Exception as e:
        print(f"Due_date column exists or error: {e}")

print("Migration complete!")
