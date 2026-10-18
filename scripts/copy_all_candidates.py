import os
import shutil

inspect_dir = r"F:\Stayo game\scripts\all_candidates"
os.makedirs(inspect_dir, exist_ok=True)

files = [
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data\f_003384", "default_f_003384.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data\f_0037b8", "default_f_0037b8.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data\f_0037bd", "default_f_0037bd.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 2\Cache\Cache_Data\f_0012dc", "p2_f_0012dc.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 2\Cache\Cache_Data\f_0012e0", "p2_f_0012e0.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 2\Cache\Cache_Data\f_0012e3", "p2_f_0012e3.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 5\Cache\Cache_Data\f_001d25", "p5_f_001d25.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 5\Cache\Cache_Data\f_001d26", "p5_f_001d26.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 5\Cache\Cache_Data\f_001d28", "p5_f_001d28.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 5\Cache\Cache_Data\f_001d29", "p5_f_001d29.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 5\Cache\Cache_Data\f_001d2a", "p5_f_001d2a.png"),
    (r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 5\Cache\Cache_Data\f_001d2b", "p5_f_001d2b.png"),
]

for src, dst_name in files:
    dst = os.path.join(inspect_dir, dst_name)
    shutil.copy2(src, dst)
    print("Copied", dst_name)
