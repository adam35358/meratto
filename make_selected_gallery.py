import os
from PIL import Image

candidates = [
    ('product_1.jpg', 'WEB/public/images/products'),
    ('product_2.jpg', 'WEB/public/images/products'),
    ('product_3.jpg', 'WEB/public/images/products'),
    ('product_4.jpg', 'WEB/public/images/products'),
    ('product_5.jpg', 'WEB/public/images/products'),
    ('product_6.jpg', 'WEB/public/images/products'),
    ('product_7.jpg', 'WEB/public/images/products'),
    ('product_8.jpg', 'WEB/public/images/products'),
    ('product_9.jpg', 'WEB/public/images/products'),
    ('product_10.jpg', 'WEB/public/images/products'),
    ('product_11.jpg', 'WEB/public/images/products'),
    ('product_12.jpg', 'WEB/public/images/products'),
    ('product_13.jpg', 'WEB/public/images/products'),
    ('product_14.jpg', 'WEB/public/images/products'),
    ('product_15.jpg', 'WEB/public/images/products'),
    ('product_16.jpg', 'WEB/public/images/products'),
    ('product_17.jpg', 'WEB/public/images/products'),
    ('product_18.jpg', 'WEB/public/images/products'),
    ('product_19.jpg', 'WEB/public/images/products'),
    ('product_20.jpg', 'WEB/public/images/products'),
    ('product_25.jpg', 'WEB/public/images/products'),
    ('f_000304.jpg', 'temp_cache_all'),
    ('f_000305.jpg', 'temp_cache_all'),
    ('f_000306.jpg', 'temp_cache_all'),
    ('f_0003cf.jpg', 'temp_cache_all'),
    ('f_0003d0.jpg', 'temp_cache_all'),
    ('f_000298.jpg', 'temp_cache_all'),
    ('f_0002af.jpg', 'temp_cache_all'),
    ('f_0002b0.jpg', 'temp_cache_all'),
    ('f_0002c6.jpg', 'temp_cache_all'),
    ('f_0002d7.jpg', 'temp_cache_all'),
    ('f_0002e1.jpg', 'temp_cache_all'),
    ('f_0002e3.jpg', 'temp_cache_all'),
    ('f_000269.jpg', 'temp_cache_all'),
    ('f_000236.jpg', 'temp_cache_all'),
    ('f_0001fe.jpg', 'temp_cache_all')
]

html = """<!DOCTYPE html><html><head><meta charset='utf-8'><title>Selected Visuals</title>
<style>
body { background: #07080a; color: #eee; font-family: sans-serif; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.card { background: #11141a; border-radius: 8px; border: 1px solid #222; overflow: hidden; padding: 6px; }
img { width: 100%; height: 260px; object-fit: contain; background: #000; border-radius: 4px; }
.t { font-size: 11px; color: #e5c378; margin-top: 4px; word-break: break-all; }
</style></head><body><h1>Visual Review</h1><div class='grid'>"""

for fn, d in candidates:
    p = os.path.join(d, fn)
    if os.path.exists(p):
        html += f"""<div class='card'>
            <img src='{p}' />
            <div class='t'>{fn}</div>
        </div>"""

html += "</div></body></html>"
with open('selected_visuals.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Saved selected_visuals.html!")
