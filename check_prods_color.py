from PIL import Image
import os

images_to_check = [
    'product_11.jpg', 'product_12.jpg', 'product_13.jpg', 'product_15.jpg',
    'product_17.jpg', 'product_18.jpg', 'product_19.jpg', 'product_20.jpg',
    'product_21.jpg', 'product_22.jpg', 'product_23.jpg', 'product_24.jpg',
    'product_25.jpg'
]

for fn in images_to_check:
    fp = os.path.join('WEB/public/images/products', fn)
    if os.path.exists(fp):
        im = Image.open(fp)
        w, h = im.size
        # sample colors in top, mid, bot
        c_top = im.crop((w//4, h//6, 3*w//4, h//3)).resize((1,1)).getpixel((0,0))
        c_mid = im.crop((w//4, 4*h//10, 3*w//4, 6*h//10)).resize((1,1)).getpixel((0,0))
        c_bot = im.crop((w//4, 7*h//10, 3*w//4, 9*h//10)).resize((1,1)).getpixel((0,0))
        print(f"{fn}: {w}x{h}, top={c_top}, mid={c_mid}, bot={c_bot}")
