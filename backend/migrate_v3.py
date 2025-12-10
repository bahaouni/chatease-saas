import sqlite3
import os

db_path = 'instance/app_v2.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Adding system_prompt column...")
    try:
        cursor.execute("ALTER TABLE user ADD COLUMN system_prompt TEXT")
        print("Success.")
    except Exception as e:
        print(f"Skipped (maybe exists): {e}")

    conn.commit()
    print("Migration completed.")
except Exception as e:
    print(f"Migration failed: {e}")
finally:
    if conn:
        conn.close()
