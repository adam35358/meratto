import os
from PIL import Image

# Let's inspect product_1 to 25 and real_ files in WEB/public/images/products:
folder = 'WEB/public/images/products'
files = [
    'product_3.jpg', 'product_4.jpg', 'product_5.jpg', 'product_6.jpg', 'product_7.jpg',
    'product_8.jpg', 'product_9.jpg', 'product_10.jpg', 'product_11.jpg', 'product_12.jpg',
    'product_13.jpg', 'product_14.jpg', 'product_15.jpg', 'product_16.jpg', 'product_17.jpg',
    'product_18.jpg', 'product_19.jpg', 'product_20.jpg', 'product_21.jpg', 'product_22.jpg',
    'product_23.jpg', 'product_24.jpg', 'product_25.jpg',
    'real_pants_denim_dark.jpg', 'real_pants_chinos_beige.jpg', 'real_pants_wool_trousers.jpg',
    'real_pants_sportchic_navy.jpg', 'real_shoes_leather_brown.jpg', 'real_shoes_navy_sneakers.jpg',
    'real_shoes_white_casual.jpg', 'real_woufx_jacket_olive.jpg', 'real_woufx_jacket_navy.jpg',
    'real_woufx_dvoyka_wine.jpg', 'real_woufx_knit_navy.jpg', 'real_woufx_flatlay_outfit.jpg'
]

html = """<!DOCTYPE html><html><head><style>
body { background: #07080a; color: #fff; font-family: monospace; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 15px; }
.card { background: #111; border: 1px solid #333; padding: 8px; border-radius: 8px; text-align: center; }
img { width: 100%; height: 300px; object-fit: contain; }
p { font-size: 11px; margin: 4px 0 0; }
</style></head><body><div class="grid">"""

for fn in files:
    p = os.path.join(folder, fn)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        sz = os.path.getsize(p) // 1024
        html += f"""<div class="card">
            <img src="{p}">
            <p><b>{fn}</b><br>{w}x{h} &bull; {sz}KB</p>
        </div>"""

html += "</div></body></html>"
with open('verify_product_assets.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved verify_product_assets.html!")
