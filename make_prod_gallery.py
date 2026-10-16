import os
from PIL import Image

html = """<!DOCTYPE html><html><head><meta charset='utf-8'><title>Product 1 to 25</title>
<style>
body { background: #07080a; color: #fff; font-family: sans-serif; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.card { background: #11141a; border-radius: 8px; border: 1px solid #333; overflow: hidden; padding: 8px; }
img { width: 100%; height: 300px; object-fit: contain; background: #000; border-radius: 4px; }
.title { font-size: 13px; color: #e5c378; margin-top: 6px; }
</style></head><body><h1>Existing product_1 to 25</h1><div class='grid'>"""

for i in range(1, 26):
    fn = f"product_{i}.jpg"
    p = os.path.join('WEB/public/images/products', fn)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        html += f"""<div class='card'>
            <img src='WEB/public/images/products/{fn}' />
            <div class='title'>{fn} ({w}x{h})</div>
        </div>"""

html += "</div></body></html>"
with open('product_1_to_25.html', 'w', encoding='utf-8') as out:
    out.write(html)
print("Saved product_1_to_25.html!")
