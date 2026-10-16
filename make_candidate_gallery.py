import os, glob
from PIL import Image

# Let's inspect all images with size > 100KB in temp_cache_all and temp_cache_images
candidates = {}
for folder in ['temp_cache_all', 'temp_cache_images']:
    for f in glob.glob(f'{folder}/*.jpg'):
        sz = os.path.getsize(f)
        if sz > 120000:
            name = os.path.basename(f)
            if name not in candidates or sz > candidates[name][1]:
                candidates[name] = (f, sz)

items = list(candidates.values())
items.sort(key=lambda x: x[1], reverse=True)

html = """<!DOCTYPE html><html><head><style>
body { background: #07080a; color: #fff; font-family: sans-serif; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; padding: 20px; }
.card { background: #111; border: 1px solid #333; padding: 10px; border-radius: 8px; text-align: center; }
img { width: 100%; height: 320px; object-fit: contain; }
p { font-size: 11px; margin: 5px 0 0; word-break: break-all; }
</style></head><body><div class="grid">"""

for f, sz in items[:60]:
    im = Image.open(f)
    w, h = im.size
    rel_path = f.replace('\\', '/')
    html += f"""<div class="card">
        <img src="{rel_path}">
        <p><b>{os.path.basename(f)}</b><br>{w}x{h} &bull; {sz//1024}KB</p>
    </div>"""

html += "</div></body></html>"
with open('catalog_candidates.html', 'w', encoding='utf-8') as out:
    out.write(html)

print(f"Generated catalog_candidates.html with {min(60, len(items))} items")
