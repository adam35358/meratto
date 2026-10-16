import os
import glob
from PIL import Image

files = sorted(glob.glob('temp_cache_images/*.jpg'))
print(f"Total files in cache: {len(files)}")

# Let's inspect all images with size >= 50KB
candidates = []
for f in files:
    sz = os.path.getsize(f)
    if sz > 80000: # at least 80KB
        try:
            im = Image.open(f)
            candidates.append((f, im.size, sz // 1024))
        except Exception:
            pass

print(f"Found {len(candidates)} high-quality images:")
for c in candidates:
    print(f"  {os.path.basename(c[0])}: {c[1][0]}x{c[1][1]} ({c[2]} KB)")
