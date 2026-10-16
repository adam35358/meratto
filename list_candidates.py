import os, glob
from PIL import Image

# Let's inspect the images in temp_cache_all and temp_cache_images
files = glob.glob('temp_cache_all/*.jpg') + glob.glob('temp_cache_images/*.jpg')
info = []
for f in files:
    try:
        im = Image.open(f)
        w, h = im.size
        sz = os.path.getsize(f)
        if sz > 150000: # high quality (>150KB)
            info.append((f, w, h, sz))
    except:
        pass

print(f"High-quality files: {len(info)}")
# Sort by size
info.sort(key=lambda x: x[3], reverse=True)
for f, w, h, sz in info[:30]:
    print(f"{os.path.basename(f)}: {w}x{h}, {sz//1024}KB")
