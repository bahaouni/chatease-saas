from app import app
from models import db
from sqlalchemy import text

def migrate():
    with app.app_context():
        print("--- STARTING PRODUCTION MIGRATION ---")
        with db.engine.connect() as conn:
            # 1. Add User columns (from v4)
            columns = [
                ("bot_enabled", "BOOLEAN DEFAULT TRUE"),
                ("active_outside_business_hours", "BOOLEAN DEFAULT FALSE"),
                ("business_start_hour", "INTEGER DEFAULT 9"),
                ("business_end_hour", "INTEGER DEFAULT 17"),
                ("bot_language", "VARCHAR(10) DEFAULT 'en'"),
                ("role", "VARCHAR(20) DEFAULT 'user'") # from v5
            ]
            
            print("Checking/Adding User columns...")
            for col_name, col_type in columns:
                try:
                    conn.execute(text(f"ALTER TABLE \"user\" ADD COLUMN {col_name} {col_type}"))
                    print(f"Added column: {col_name}")
                except Exception as e:
                    print(f"Skipped {col_name} (likely exists): {str(e)}")

            # 2. Create CommandLog table (v4)
            print("Creating command_log table...")
            try:
                conn.execute(text("""
                CREATE TABLE IF NOT EXISTS command_log (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES \"user\"(id),
                    customer_number VARCHAR(50) NOT NULL,
                    command_type VARCHAR(20) NOT NULL,
                    message_content TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """))
                print("Success: command_log table")
            except Exception as e:
                print(f"Error creating command_log: {e}")

            # 3. Create Feedback table (v5)
            print("Creating feedback table...")
            try:
                conn.execute(text("""
                CREATE TABLE IF NOT EXISTS feedback (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES \"user\"(id),
                    message TEXT NOT NULL,
                    type VARCHAR(20) DEFAULT 'general',
                    status VARCHAR(20) DEFAULT 'new',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """))
                print("Success: feedback table")
            except Exception as e:
                print(f"Error creating feedback table: {e}")

            # 4. Add rating to feedback (v6)
            print("Adding rating to feedback...")
            try:
                conn.execute(text("ALTER TABLE feedback ADD COLUMN rating INTEGER DEFAULT 0"))
                print("Success: Added rating")
            except Exception as e:
                print(f"Skipped rating (likely exists): {e}")

            conn.commit()
            print("--- MIGRATION COMPLETE ---")

if __name__ == "__main__":
    migrate()
