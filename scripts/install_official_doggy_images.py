import os
import shutil

src_dir = r"F:\Stayo game\scripts\all_candidates"
dest_dir = r"F:\Stayo game\public\assets\doggy-expressions"
os.makedirs(dest_dir, exist_ok=True)

# Copy the 6 official 800x800 PNG images
official_mappings = {
    "p5_f_001d29.png": "doggy-neutral.png",
    "p5_f_001d2a.png": "doggy-happy.png",
    "p5_f_001d25.png": "doggy-confused.png",  # thinking bubble
    "p5_f_001d26.png": "doggy-waving.png",    # wave / excited
    "p5_f_001d28.png": "doggy-sleepy.png",    # sleeping zzz
    "p5_f_001d2b.png": "doggy-jumping.png",   # jumping / arms up in the air
}

for src_file, dest_file in official_mappings.items():
    s = os.path.join(src_dir, src_file)
    d = os.path.join(dest_dir, dest_file)
    shutil.copy2(s, d)
    print(f"Copied {src_file} -> {dest_file} ({os.path.getsize(d)} bytes)")

# Also copy official SVGs from Downloads
dl_dir = r"C:\Users\Pc\Downloads"
svg_mappings = {
    "stayo-mascot-happy.svg": "doggy-happy.svg",
    "stayo-mascot-neutral.svg": "doggy-neutral.svg",
    "stayo-mascot-sleepy.svg": "doggy-sleepy.svg",
    "stayo-mascot-thinking.svg": "doggy-confused.svg",
    "stayo-mascot-waving.svg": "doggy-waving.svg",
}

for src_file, dest_file in svg_mappings.items():
    s = os.path.join(dl_dir, src_file)
    d = os.path.join(dest_dir, dest_file)
    if os.path.exists(s):
        shutil.copy2(s, d)
        print(f"Copied SVG {src_file} -> {dest_file}")
