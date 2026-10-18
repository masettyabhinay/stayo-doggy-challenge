import sqlite3
import glob
import os
import shutil

user_data = r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data"
for hist in glob.glob(os.path.join(user_data, "*", "History")):
    prof = os.path.basename(os.path.dirname(hist))
    tmp_hist = os.path.join(r"C:\Users\Pc\AppData\Local\Temp", f"hist_{prof}.db")
    try:
        shutil.copy2(hist, tmp_hist)
        conn = sqlite3.connect(tmp_hist)
        cur = conn.cursor()
        cur.execute("SELECT url, title FROM urls WHERE url LIKE '%1OwD-u7dZwGYmS7EwTFTLS-dki_lBknf3%'")
        rows = cur.fetchall()
        if rows:
            print(f"FOUND in {prof}:")
            for r in rows:
                print("  ", r)
        conn.close()
        os.remove(tmp_hist)
    except Exception as e:
        # print(e)
        pass
