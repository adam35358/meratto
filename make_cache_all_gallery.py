import os
import glob
from PIL import Image

files = sorted(glob.glob('temp_cache_all/*.*'))
print(f"Total files in temp_cache_all: {len(files)}")

html = """<!DOCTYPE html><html><head><meta charset='utf-8'><title>Cache All</title>
<style>
body { background: #07080a; color: #eee; font-family: sans-serif; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.card { background: #11141a; border-radius: 8px; border: 1px solid #222; overflow: hidden; padding: 8px; }
img { width: 100%; height: 260px; object-fit: contain; background: #000; border-radius: 4px; }
.title { font-size: 11px; color: #e5c378; margin-top: 6px; word-break: break-all; }
.meta { font-size: 10px; color: #888; margin-top: 2px; }
</style></head><body><h1>All Cache Images (temp_cache_all)</h1><div class='grid'>"""

for f in files:
    try:
        im = Image.open(f)
        w, h = im.size
        sz = os.path.getsize(f) // 1024
        bn = os.path.basename(f)
        html += f"""<div class='card'>
            <img src='temp_cache_all/{bn}' loading='lazy' />
            <div class='title'>{bn}</div>
            <div class='meta'>{w}x{h} &bull; {sz}KB</div>
        </div>"""
    except Exception:
        pass

html += "</div></body></html>"

with open('cache_all_gallery.html', 'w', encoding='utf-8') as out:
    out.write(html)

print("Saved cache_all_gallery.html with all images!")
