import sqlite3
import os

paths = ['app_v2.db', 'instance/app_v2.db']

for p in paths:
    if os.path.exists(p):
        print(f"--- DB found at: {p} ---")
        try:
            conn = sqlite3.connect(p)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            print("Tables:", tables)
            
            for t in tables:
                t_name = t[0]
                print(f"Schema for {t_name}:")
                cursor.execute(f"PRAGMA table_info({t_name})")
                cols = cursor.fetchall()
                for c in cols:
                    print(f"  - {c[1]} ({c[2]})")
            conn.close()
        except Exception as e:
            print(f"Error reading {p}: {e}")
    else:
        print(f"--- DB NOT found at: {p} ---")
