import os
import glob

def find_images_in_cache(cache_dir):
    images = []
    if not os.path.exists(cache_dir):
        return images
    
    # PNG signature: 89 50 4E 47 0D 0A 1A 0A
    PNG_SIG = b"\x89PNG\r\n\x1a\n"
    # JPEG signature: FF D8 FF
    JPG_SIG = b"\xff\xd8\xff"
    # WEBP signature: RIFF....WEBP
    # SVG signature: <svg
    
    for f in glob.glob(os.path.join(cache_dir, "*")):
        if os.path.isfile(f) and not f.endswith(".db") and not f.endswith(".txt"):
            try:
                with open(f, "rb") as fp:
                    header = fp.read(1024)
                    if PNG_SIG in header:
                        images.append((f, "png", os.path.getsize(f)))
                    elif JPG_SIG in header[:4]:
                        images.append((f, "jpg", os.path.getsize(f)))
                    elif b"RIFF" in header[:4] and b"WEBP" in header[:16]:
                        images.append((f, "webp", os.path.getsize(f)))
                    elif b"<svg" in header:
                        images.append((f, "svg", os.path.getsize(f)))
            except Exception:
                pass
    return images

user_data = r"C:\Users\Pc\AppData\Local\Google\Chrome\User Data"
for prof in ["Profile 5", "Profile 2", "Default", "Profile 1"]:
    cache_path = os.path.join(user_data, prof, "Cache", "Cache_Data")
    found = find_images_in_cache(cache_path)
    print(f"{prof} cache images count: {len(found)}")
    # Print any found that are reasonably sized (e.g. > 5KB)
    for path, ext, sz in found:
        if 5000 < sz < 10000000:
            print(f"  {prof}: {os.path.basename(path)} ({ext}, {sz} bytes)")
