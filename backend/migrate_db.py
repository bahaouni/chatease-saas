import sqlite3
import os

db_path = 'app_v2.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Adding ai_api_key column...")
    try:
        cursor.execute("ALTER TABLE user ADD COLUMN ai_api_key TEXT")
        print("Success.")
    except Exception as e:
        print(f"Skipped (maybe exists): {e}")

    print("Adding ai_provider column...")
    try:
        cursor.execute("ALTER TABLE user ADD COLUMN ai_provider TEXT DEFAULT 'openai'")
        print("Success.")
    except Exception as e:
        print(f"Skipped (maybe exists): {e}")

    print("Creating WhatsAppConnection table...")
    try:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS whats_app_connection (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            waba_id VARCHAR(50) NOT NULL,
            phone_number_id VARCHAR(50) NOT NULL,
            display_phone_number VARCHAR(20),
            access_token TEXT NOT NULL,
            token_expires_at DATETIME,
            business_id VARCHAR(50),
            created_at DATETIME,
            FOREIGN KEY(user_id) REFERENCES user(id)
        )
        """)
        print("Success.")
    except Exception as e:
        print(f"Failed to create table: {e}")

    conn.commit()
    print("Migration completed.")
except Exception as e:
    print(f"Migration failed: {e}")
finally:
    if conn:
        conn.close()
