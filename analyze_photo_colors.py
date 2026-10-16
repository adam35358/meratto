import os, glob
from PIL import Image

# Let's inspect the top 40 images from catalog_candidates.html
# and print their properties:
# Is it vertical portrait? (e.g. AR > 1.3)
# Dominant colors, brightness, etc.
files = glob.glob('temp_cache_all/*.jpg')
for f in files:
    try:
        im = Image.open(f)
        w, h = im.size
        sz = os.path.getsize(f)
        if sz > 200000 and (w >= 1000 or h >= 1000):
            # Sample center color
            rgb_im = im.convert('RGB')
            center_color = rgb_im.getpixel((w//2, h//2))
            top_color = rgb_im.getpixel((w//2, h//6))
            bottom_color = rgb_im.getpixel((w//2, int(h*0.85)))
            print(f"{os.path.basename(f)}: {w}x{h}, {sz//1024}KB, Top:{top_color}, Mid:{center_color}, Bot:{bottom_color}")
    except:
        pass
