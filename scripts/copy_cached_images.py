import os
import shutil

inspect_dir = r"F:\Stayo game\scripts\cache_inspect"
os.makedirs(inspect_dir, exist_ok=True)

# Profile 5 candidates
p5_cache = r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 5\Cache\Cache_Data"
p5_files = [
    "f_001d1d", "f_001d25", "f_001d26", "f_001d28", "f_001d29", "f_001d2a", "f_001d2b"
]

for fn in p5_files:
    src = os.path.join(p5_cache, fn)
    dst = os.path.join(inspect_dir, f"p5_{fn}.png")
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print("Copied", fn, "to", dst)

# Profile 2 candidates
p2_cache = r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data\Profile 2\Cache\Cache_Data"
p2_files = [
    "f_00020d", "f_00020e", "f_00020f", "f_000210", "f_000211", "f_000212"
]

for fn in p2_files:
    src = os.path.join(p2_cache, fn)
    dst = os.path.join(inspect_dir, f"p2_{fn}.png")
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print("Copied", fn, "to", dst)
