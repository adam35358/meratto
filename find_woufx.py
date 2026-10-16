import sqlite3
import os
import shutil

history_db = os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data\Default\History')
print('Checking history db at:', history_db)

shutil.copy2(history_db, 'temp_history.db')
conn = sqlite3.connect('temp_history.db')
cursor = conn.cursor()

# Query for woufx or similar
cursor.execute("SELECT url, title, visit_count, last_visit_time FROM urls WHERE lower(url) LIKE '%wouf%' OR lower(title) LIKE '%wouf%' OR lower(url) LIKE '%woux%' ORDER BY last_visit_time DESC LIMIT 30")
rows = cursor.fetchall()
print(f'Found {len(rows)} matches:')
for r in rows:
    print(r)

# If no exact match, let's search recent urls visited today/yesterday
if not rows:
    print("\nNo direct 'wouf' match, listing the latest 30 URLs from history:")
    cursor.execute("SELECT url, title FROM urls ORDER BY last_visit_time DESC LIMIT 30")
    for r in cursor.fetchall():
        print(r)

conn.close()
if os.path.exists('temp_history.db'):
    os.remove('temp_history.db')
