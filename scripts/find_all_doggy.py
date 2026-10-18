import os
import glob
from PIL import Image

user_data = r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data"
found_doggy = []

for root, dirs, files in os.walk(user_data):
    if "Cache_Data" in root:
        for f in files:
            fp = os.path.join(root, f)
            if os.path.isfile(fp) and 15000 < os.path.getsize(fp) < 100000:
                try:
                    with Image.open(fp) as im:
                        if im.size == (800, 800):
                            found_doggy.append((fp, im.format, os.path.getsize(fp)))
                            print("Found 800x800:", fp, os.path.getsize(fp))
                except Exception:
                    pass

print(f"Total 800x800 images found: {len(found_doggy)}")
