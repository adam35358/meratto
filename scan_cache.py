import os, glob
from PIL import Image

# Let's check files in temp_cache_all with names from f_000200 to f_000300
files = sorted(glob.glob('temp_cache_all/*.jpg'))
print(f"Total files: {len(files)}")
for f in files:
    sz = os.path.getsize(f)
    if sz > 150000:
        im = Image.open(f)
        w, h = im.size
        # let's print aspect ratio and size
        print(f"{os.path.basename(f)}: {w}x{h}, {sz//1024}KB, AR:{h/w:.2f}")
