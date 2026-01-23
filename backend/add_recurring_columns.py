from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    # Add recurring task columns if they don't exist
    columns_to_add = [
        ("is_recurring", "BOOLEAN DEFAULT FALSE"),
        ("recurrence_rule", "VARCHAR(500)"),
        ("parent_task_id", "INTEGER REFERENCES task(id)"),
        ("next_occurrence", "TIMESTAMP"),
        ("last_occurrence", "TIMESTAMP"),
        ("end_date", "TIMESTAMP"),
        ("max_occurrences", "INTEGER"),
        ("occurrences_count", "INTEGER DEFAULT 0"),
    ]
    
    for col_name, col_type in columns_to_add:
        try:
            conn.execute(text(f"ALTER TABLE task ADD COLUMN {col_name} {col_type}"))
            conn.commit()
            print(f"✓ Added {col_name} column")
        except Exception as e:
            print(f"  {col_name} column exists or error: {str(e)[:100]}")

print("\n✓ Migration complete!")
