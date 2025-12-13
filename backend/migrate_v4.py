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
    print(f"--- Migrating {db_path} ---")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # 1. Add User columns
        user_columns = [
            ("bot_enabled", "BOOLEAN DEFAULT 1"),
            ("active_outside_business_hours", "BOOLEAN DEFAULT 0"),
            ("business_start_hour", "INTEGER DEFAULT 9"),
            ("business_end_hour", "INTEGER DEFAULT 17"),
            ("bot_language", "VARCHAR(10) DEFAULT 'en'")
        ]

        for col_name, col_type in user_columns:
            try:
                print(f"Adding {col_name} to user...")
                cursor.execute(f"ALTER TABLE user ADD COLUMN {col_name} {col_type}")
                print(f"Success: {col_name}")
            except Exception as e:
                # e.g., "duplicate column name: bot_enabled"
                print(f"Skipped {col_name}: {e}")

        # 2. Create CommandLog table
        print("Creating CommandLog table...")
        try:
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS command_log (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                customer_number VARCHAR(50) NOT NULL,
                command_type VARCHAR(20) NOT NULL,
                message_content TEXT NOT NULL,
                timestamp DATETIME,
                FOREIGN KEY(user_id) REFERENCES user(id)
            )
            """)
            print("Success: command_log table created.")
        except Exception as e:
            print(f"Failed to create command_log table: {e}")

        conn.commit()
        conn.close()
        print(f"--- Completed {db_path} ---")
    except Exception as e:
        print(f"Migration failed for {db_path}: {e}")
