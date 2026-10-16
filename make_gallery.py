import os
import glob
from PIL import Image

files = sorted(glob.glob('temp_cache_images/*.jpg'))

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>All 102 Cache Images</title>
<style>
  body { background: #090a0f; color: #fff; font-family: sans-serif; padding: 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .card { background: #141721; border-radius: 8px; border: 1px solid #232936; overflow: hidden; }
  img { width: 100%; height: 280px; object-fit: contain; background: #000; display: block; }
  .info { padding: 10px; font-size: 12px; }
  .name { font-weight: bold; color: #d4af37; word-break: break-all; }
  .dim { color: #888; margin-top: 4px; }
</style>
</head>
<body>
<h1>All 102 Meratto Cache Images</h1>
<div class="grid">
"""

for f in files:
    bn = os.path.basename(f)
    try:
        im = Image.open(f)
        w, h = im.size
        sz = os.path.getsize(f) // 1024
        html += f"""<div class="card">
          <img src="temp_cache_images/{bn}" loading="lazy" />
          <div class="info">
            <div class="name">{bn}</div>
            <div class="dim">{w}x{h} &bull; {sz} KB</div>
          </div>
        </div>"""
    except Exception as e:
        pass

html += """</div></body></html>"""

with open('all_cache_gallery.html', 'w', encoding='utf-8') as out:
    out.write(html)
print("Saved all_cache_gallery.html successfully!")
