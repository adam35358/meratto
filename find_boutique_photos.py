import os
from PIL import Image

cache_dir = 'temp_cache_all'
files = [f for f in os.listdir(cache_dir) if f.endswith(('.jpg', '.webp'))]

results = []
for f in files:
    p = os.path.join(cache_dir, f)
    sz = os.path.getsize(p)
    if sz > 150000: # high quality (>150KB)
        try:
            im = Image.open(p)
            results.append((f, im.size, sz // 1024))
        except:
            pass

print(f"Total large images in cache: {len(results)}")
for r in results[:40]:
    print(f"{r[0]}: {r[1][0]}x{r[1][1]} ({r[2]} KB)")
