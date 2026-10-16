from PIL import Image
import os

files = [
    'f_0002e9.jpg', 'f_000302.jpg', 'f_000303.jpg',
    'f_000304.jpg', 'f_000305.jpg', 'f_000306.jpg',
    'f_0003cf.jpg', 'f_0003d0.jpg', 'f_000298.jpg'
]

for f in files:
    p = os.path.join('temp_cache_all', f)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        print(f"--- {f} ({w}x{h}) ---")
        # Sample 5 vertical points down the center
        for y_pct in [0.15, 0.35, 0.5, 0.7, 0.85]:
            pix = im.crop((int(w*0.35), int(h*y_pct), int(w*0.65), int(h*y_pct)+20)).resize((1,1)).getpixel((0,0))
            print(f"  y={int(y_pct*100)}%: {pix}")
