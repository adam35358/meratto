import os, glob
from PIL import Image

# Let's inspect all files in temp_cache_all, temp_cache_images, and WEB/public/images/products
all_images = []
for d in ['temp_cache_all', 'temp_cache_images', 'WEB/public/images/products']:
    for f in glob.glob(f'{d}/*.*'):
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            sz = os.path.getsize(f)
            if sz > 100000: # high quality only
                all_images.append(f)

print(f"Total high-quality images: {len(all_images)}")

# Let's write an HTML page where all high quality images are shown with their filename and dimensions
html = """<!DOCTYPE html><html><head><meta charset='utf-8'><style>
body { background: #07080a; color: #fff; font-family: sans-serif; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.card { background: #11141a; border: 1px solid #222; border-radius: 8px; padding: 8px; text-align: center; }
img { width: 100%; height: 320px; object-fit: contain; background: #000; border-radius: 4px; }
p { font-size: 11px; margin: 4px 0 0; color: #e5c378; word-break: break-all; }
</style></head><body><div class="grid">"""

seen = set()
for f in all_images:
    fn = os.path.basename(f)
    if fn in seen:
        continue
    seen.add(fn)
    try:
        im = Image.open(f)
        w, h = im.size
        sz = os.path.getsize(f) // 1024
        p = f.replace('\\', '/')
        html += f"""<div class="card">
            <img src="{p}" loading="lazy">
            <p><b>{fn}</b><br>{w}x{h} &bull; {sz}KB<br>{os.path.dirname(p)}</p>
        </div>"""
    except:
        pass

html += "</div></body></html>"
with open('all_high_res_visuals.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Saved all_high_res_visuals.html with", len(seen), "images")
