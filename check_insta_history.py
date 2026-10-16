import sqlite3
import os
import shutil

history_db = os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data\Default\History')
shutil.copy2(history_db, 'temp_history.db')
conn = sqlite3.connect('temp_history.db')
cursor = conn.cursor()

cursor.execute("SELECT url, title, last_visit_time FROM urls WHERE url LIKE '%instagram.com%' ORDER BY last_visit_time DESC LIMIT 40")
rows = cursor.fetchall()
print(f"Found {len(rows)} Instagram URLs in history:")
for r in rows:
    print(r)

conn.close()
os.remove('temp_history.db')
