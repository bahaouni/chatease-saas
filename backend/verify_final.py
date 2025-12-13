import sqlite3
import os

db_path = 'instance/app_v2.db'
if not os.path.exists(db_path):
    print("Instance DB missing, checking root...")
    db_path = 'app_v2.db'
    print("DB missing")
    exit(1)

conn = sqlite3.connect(db_path)
cur = conn.cursor()
try:
    cur.execute("SELECT bot_enabled, active_outside_business_hours, business_start_hour, business_end_hour, bot_language FROM user LIMIT 1")
    print("User columns OK")
    cur.execute("SELECT id, customer_number, command_type FROM command_log LIMIT 1")
    print("CommandLog table OK")
    print("VERIFICATION SUCCESS")
except Exception as e:
    print(f"VERIFICATION FAILED: {e}")
finally:
    conn.close()
