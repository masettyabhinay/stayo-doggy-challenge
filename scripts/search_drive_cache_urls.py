import os
import sqlite3
import glob

user_data = r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 5"
tmp_dir = r"C:\Users\Pc\AppData\Local\Temp"

# Search History
hist = os.path.join(user_data, "History")
tmp_hist = os.path.join(tmp_dir, "hist_p5_search.db")
if os.path.exists(hist):
    import shutil
    shutil.copy2(hist, tmp_hist)
    conn = sqlite3.connect(tmp_hist)
    cur = conn.cursor()
    cur.execute("SELECT url, title FROM urls WHERE url LIKE '%drive.google.com%' OR title LIKE '%Mascot%' OR title LIKE '%Dog%' OR title LIKE '%Stayo%'")
    for row in cur.fetchall():
        print("History:", row)
    conn.close()
    os.remove(tmp_hist)

# Search Chrome cache URLs for Drive items
# In Chrome Cache, the index file or entry headers store the original URL!
