import sqlite3
import os

paths_to_migrate = []
if os.path.exists('app_v2.db'):
    paths_to_migrate.append('app_v2.db')
if os.path.exists('instance/app_v2.db'):
    paths_to_migrate.append('instance/app_v2.db')

if not paths_to_migrate:
    print("No DB found")
    exit(1)

for db_path in paths_to_migrate:
    print(f"--- Migrating v5 {db_path} ---")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # 1. Add User.role
        try:
            print("Adding role to user...")
            cursor.execute("ALTER TABLE user ADD COLUMN role VARCHAR(20) DEFAULT 'user'")
            print("Success: role")
        except Exception as e:
            print(f"Skipped role: {e}")

        # 2. Create Feedback table
        print("Creating Feedback table...")
        try:
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                message TEXT NOT NULL,
                type VARCHAR(20) DEFAULT 'general',
                status VARCHAR(20) DEFAULT 'new',
                created_at DATETIME,
                FOREIGN KEY(user_id) REFERENCES user(id)
            )
            """)
            print("Success: feedback table created.")
        except Exception as e:
            print(f"Failed to create feedback table: {e}")

        conn.commit()
        conn.close()
        print(f"--- Completed {db_path} ---")
    except Exception as e:
        print(f"Migration failed for {db_path}: {e}")
