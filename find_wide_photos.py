import os
from PIL import Image

cache_dir = 'temp_cache_all'
files = [f for f in os.listdir(cache_dir) if f.endswith(('.jpg', '.webp'))]

wide_files = []
for f in files:
    p = os.path.join(cache_dir, f)
    try:
        im = Image.open(p)
        w, h = im.size
        # Wide or near-square images
        if w >= h * 0.8:
            wide_files.append((f, (w, h), os.path.getsize(p) // 1024))
    except:
        pass

print("Wide/Square images in cache:")
for item in wide_files:
    print(f"  {item[0]}: {item[1][0]}x{item[1][1]} ({item[2]} KB)")
