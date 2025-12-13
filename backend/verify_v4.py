import sqlite3
import os

# Check DB path logic again
if os.path.exists('app_v2.db'):
    db_path = 'app_v2.db'
elif os.path.exists('instance/app_v2.db'):
    db_path = 'instance/app_v2.db'
else:
    print("DB not found")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def check_column(table, col):
    try:
        cursor.execute(f"SELECT {col} FROM {table} LIMIT 1")
        print(f"✅ Column '{col}' exists in table '{table}'.")
    except Exception as e:
        print(f"❌ Column '{col}' MISSING in table '{table}': {e}")

print(f"Checking DB at {db_path}...")

# 1. Check User Columns
check_column('user', 'bot_enabled')
check_column('user', 'active_outside_business_hours')
check_column('user', 'bot_language')

# 2. Check CommandLog Table
try:
    cursor.execute("SELECT count(*) FROM command_log")
    print("✅ Table 'command_log' exists.")
except Exception as e:
    print(f"❌ Table 'command_log' MISSING: {e}")

conn.close()
