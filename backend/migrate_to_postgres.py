"""
Migration script to copy data from SQLite to PostgreSQL (Supabase).
Run this AFTER you have set up Supabase and have the DATABASE_URL.
"""
import os
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker

# Source: Local SQLite
sqlite_engine = create_engine('sqlite:///app_v2.db')
SQLiteSession = sessionmaker(bind=sqlite_engine)
sqlite_session = SQLiteSession()

# Destination: Supabase PostgreSQL
# You will paste your Supabase URL here
postgres_url = os.getenv('DATABASE_URL') or input("Enter your Supabase DATABASE_URL: ")
if postgres_url.startswith("postgres://"):
    postgres_url = postgres_url.replace("postgres://", "postgresql://", 1)

postgres_engine = create_engine(postgres_url)
PostgresSession = sessionmaker(bind=postgres_engine)
postgres_session = PostgresSession()

# Create tables in Postgres (using your models)
from app import app, db
with app.app_context():
    db.create_all()
    print("✅ Tables created in Supabase")

# Migrate data
metadata = MetaData()
metadata.reflect(bind=sqlite_engine)

for table_name in metadata.tables.keys():
    print(f"Migrating table: {table_name}")
    table = Table(table_name, metadata, autoload_with=sqlite_engine)
    
    # Read from SQLite
    rows = sqlite_session.execute(table.select()).fetchall()
    
    if rows:
        # Write to Postgres
        postgres_session.execute(table.insert(), [dict(row._mapping) for row in rows])
        postgres_session.commit()
        print(f"  ✅ Migrated {len(rows)} rows")
    else:
        print(f"  ⚠️  No data to migrate")

print("\n🎉 Migration complete!")
sqlite_session.close()
postgres_session.close()
