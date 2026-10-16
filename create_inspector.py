import os, glob
from PIL import Image

cache = 'temp_cache_all'
images = sorted(glob.glob(os.path.join(cache, '*.*')))

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Temp Cache All Inspector</title>
<style>
  body { background: #07090e; color: #fff; font-family: monospace; padding: 20px; }
  h1 { color: #f59e0b; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .card { background: #131722; border: 1px solid #232b3e; border-radius: 8px; overflow: hidden; }
  .img-wrap { height: 260px; background: #000; display: flex; align-items: center; justify-content: center; }
  img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .meta { padding: 8px; font-size: 11px; }
  .fname { color: #38bdf8; font-weight: bold; }
  .dim { color: #94a3b8; }
</style>
</head>
<body>
<h1>Temp Cache All Inspector ({count} images)</h1>
<div class="grid">
"""

count = 0
for p in images:
    if not p.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        continue
    try:
        im = Image.open(p)
        w, h = im.size
        sz = os.path.getsize(p) // 1024
        fn = os.path.basename(p)
        html += f"""
        <div class="card">
          <div class="img-wrap">
            <img src="{p.replace(chr(92), '/')}" loading="lazy">
          </div>
          <div class="meta">
            <div class="fname">{fn}</div>
            <div class="dim">{w}x{h} &bull; {sz}KB &bull; ratio {round(w/h, 2)}</div>
          </div>
        </div>
        """
        count += 1
    except:
        pass

html += """
</div>
</body>
</html>
"""
html = html.replace('{count}', str(count))

with open('inspect_temp_cache.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f"Generated inspect_temp_cache.html with {count} images.")
