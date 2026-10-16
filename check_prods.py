import os
from PIL import Image

for i in range(1, 26):
    fn = f'WEB/public/images/products/product_{i}.jpg'
    if os.path.exists(fn):
        im = Image.open(fn)
        w, h = im.size
        print(f"product_{i}.jpg: {w}x{h}")
