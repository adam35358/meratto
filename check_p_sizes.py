import os
from PIL import Image

folder = 'WEB/public/images/products'
for i in range(1, 26):
    fn = f'product_{i}.jpg'
    p = os.path.join(folder, fn)
    if os.path.exists(p):
        im = Image.open(p)
        print(f"{fn}: {im.size}, {os.path.getsize(p)//1024}KB")
