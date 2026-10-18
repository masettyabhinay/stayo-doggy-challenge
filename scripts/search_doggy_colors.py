import os
from PIL import Image

TERRACOTTA = (180, 106, 85)
CREAM = (235, 217, 196)

def has_doggy_colors(im):
    # Convert to RGB
    rgb_im = im.convert("RGB")
    colors = rgb_im.getcolors(maxcolors=10000)
    if not colors:
        return False
    found_terra = False
    found_cream = False
    for count, (r, g, b) in colors:
        if count > 50:
            if abs(r - 180) < 15 and abs(g - 106) < 15 and abs(b - 85) < 15:
                found_terra = True
            if abs(r - 235) < 15 and abs(g - 217) < 15 and abs(b - 196) < 15:
                found_cream = True
    return found_terra and found_cream

user_data = r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data"
matches = []

for root, dirs, files in os.walk(user_data):
    if "Cache_Data" in root:
        for f in files:
            fp = os.path.join(root, f)
            if os.path.isfile(fp) and 5000 < os.path.getsize(fp) < 500000:
                try:
                    with Image.open(fp) as im:
                        if has_doggy_colors(im):
                            matches.append((fp, im.size, os.path.getsize(fp)))
                            print("Match:", fp, im.size, os.path.getsize(fp))
                except Exception:
                    pass

print(f"Total mascot matches: {len(matches)}")
