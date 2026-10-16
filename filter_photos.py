import os
import glob
from PIL import Image

files = sorted(glob.glob('temp_cache_all/*.jpg') + glob.glob('temp_cache_all/*.webp'))
print(f"Total files: {len(files)}")

# Let's check aspect ratio and size
photos = []
for f in files:
    try:
        im = Image.open(f)
        w, h = im.size
        # Exclude very small icons (< 300px)
        if w >= 400 and h >= 400:
            photos.append((f, w, h, os.path.getsize(f)//1024))
    except Exception:
        pass

print(f"Valid high-res photos: {len(photos)}")
for p in photos:
    print(f"{os.path.basename(p[0])}: {p[1]}x{p[2]}, {p[3]}KB")
