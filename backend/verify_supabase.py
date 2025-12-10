"""
Simple test to verify Supabase connection works.
"""
import os
from sqlalchemy import create_engine, text

postgres_url = "postgresql://postgres.apdggrhtfgcrvguvhtdp:chatease-prod@aws-1-eu-west-2.pooler.supabase.com:5432/postgres"

print(f"Testing connection to: {postgres_url[:50]}...")

try:
    engine = create_engine(postgres_url)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        print(f"✅ Connection successful!")
        print(f"PostgreSQL version: {version}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("\nTroubleshooting:")
    print("1. Check if your internet is working")
    print("2. Verify the password is correct")
    print("3. Make sure Supabase project is active (not paused)")
