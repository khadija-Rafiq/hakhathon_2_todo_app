#!/usr/bin/env python3
import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

load_dotenv()

# Parse the DATABASE_URL
db_url = os.getenv("DATABASE_URL")
# postgresql+psycopg://user:password@host:port/dbname
# Extract components
parts = db_url.replace("postgresql+psycopg://", "").split("@")
user_pass = parts[0].split(":")
host_db = parts[1].split("/")
host_port = host_db[0].split(":")

user = user_pass[0]
password = user_pass[1]
host = host_port[0]
port = int(host_port[1]) if len(host_port) > 1 else 5432
dbname = host_db[1].split("?")[0]

print(f"Connecting to {dbname} at {host}...")

# Connect to the database
try:
    conn = psycopg2.connect(
        dbname=dbname,
        user=user,
        password=password,
        host=host,
        port=port,
        sslmode='require'
    )
    conn.autocommit = True
    cur = conn.cursor()
    
    # Add recurring columns
    columns = [
        ("is_recurring", "BOOLEAN DEFAULT FALSE"),
        ("recurrence_rule", "VARCHAR(500)"),
        ("parent_task_id", "INTEGER"),
        ("next_occurrence", "TIMESTAMP"),
        ("last_occurrence", "TIMESTAMP"),
        ("end_date", "TIMESTAMP"),
        ("max_occurrences", "INTEGER"),
        ("occurrences_count", "INTEGER DEFAULT 0"),
    ]
    
    for col_name, col_type in columns:
        try:
            cur.execute(f"ALTER TABLE task ADD COLUMN {col_name} {col_type};")
            print(f"✓ Added {col_name}")
        except psycopg2.Error as e:
            if "already exists" in str(e):
                print(f"  {col_name} - already exists")
            else:
                print(f"  {col_name} - error: {e}")
    
    # Now add the foreign key constraint for parent_task_id
    try:
        cur.execute("ALTER TABLE task ADD CONSTRAINT fk_parent_task FOREIGN KEY (parent_task_id) REFERENCES task(id);")
        print("✓ Added parent_task_id foreign key")
    except psycopg2.Error as e:
        if "already exists" in str(e):
            print("  parent_task_id foreign key - already exists")
        else:
            print(f"  parent_task_id foreign key - error: {e}")
    
    cur.close()
    conn.close()
    print("\n✓ Migration complete!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
