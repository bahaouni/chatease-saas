from app import app
from models import db
from sqlalchemy import text

def migrate():
    with app.app_context():
        print("Migrating: Adding 'rating' column to 'feedback' table...")
        try:
            with db.engine.connect() as conn:
                conn.execute(text("ALTER TABLE feedback ADD COLUMN rating INTEGER DEFAULT 0"))
                conn.commit()
            print("Migration successful: Added 'rating' column.")
        except Exception as e:
            print(f"Migration failed (might already exist): {e}")

if __name__ == "__main__":
    migrate()
