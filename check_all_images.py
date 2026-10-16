import os, glob
from PIL import Image

def get_info(path):
    try:
        im = Image.open(path)
        w, h = im.size
        sz = os.path.getsize(path) // 1024
        return (w, h, sz)
    except:
        return None

# Check all images in temp_cache_all
files = sorted(glob.glob('temp_cache_all/*.jpg') + glob.glob('temp_cache_all/*.webp'))
print(f"Total cache images: {len(files)}")

# Check existing products images
prod_files = sorted(glob.glob('WEB/public/images/products/*.*'))
print(f"Total existing product images: {len(prod_files)}")
for p in prod_files:
    info = get_info(p)
    if info:
        print(f"  {os.path.basename(p)}: {info[0]}x{info[1]} ({info[2]}KB)")
