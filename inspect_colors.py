from PIL import Image, ImageStat
import os

targets = [
    'f_0002e9.jpg', 'f_0002ed.jpg', 'f_000302.jpg', 'f_000303.jpg',
    'f_000304.jpg', 'f_000305.jpg', 'f_000306.jpg', 'f_0003cf.jpg',
    'f_0003d0.jpg', 'f_0003f1.jpg', 'f_0003f3.jpg', 'f_000298.jpg'
]

for t in targets:
    p = os.path.join('temp_cache_all', t)
    if os.path.exists(p):
        im = Image.open(p).convert('RGB')
        stat = ImageStat.Stat(im)
        w, h = im.size
        # sample 4 quadrants
        q1 = im.crop((0, 0, w//2, h//2)).resize((1,1)).getpixel((0,0))
        q4 = im.crop((w//2, h//2, w, h)).resize((1,1)).getpixel((0,0))
        center = im.crop((w//4, h//4, 3*w//4, 3*h//4)).resize((1,1)).getpixel((0,0))
        print(f"{t}: {w}x{h}, center={center}, q1={q1}, q4={q4}")
