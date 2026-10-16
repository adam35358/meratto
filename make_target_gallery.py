import os
from PIL import Image

targets = [
    'f_0002e9.jpg', 'f_0002ed.jpg', 'f_000302.jpg', 'f_000303.jpg',
    'f_000304.jpg', 'f_000305.jpg', 'f_000306.jpg', 'f_0003cf.jpg',
    'f_0003d0.jpg', 'f_0003f1.jpg', 'f_0003f3.jpg', 'f_000298.jpg',
    'f_0002af.jpg', 'f_0002b0.jpg', 'f_0002c6.jpg', 'f_0002c8.jpg',
    'f_0002d7.jpg', 'f_0002e1.jpg', 'f_0002e3.jpg', 'f_000269.jpg',
    'f_000236.jpg', 'f_0001fe.jpg'
]

html = """<!DOCTYPE html><html><head><meta charset='utf-8'><title>New Targets</title>
<style>
body { background: #07080a; color: #fff; font-family: sans-serif; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.card { background: #11141a; border-radius: 8px; border: 1px solid #333; overflow: hidden; padding: 8px; }
img { width: 100%; height: 320px; object-fit: contain; background: #000; border-radius: 4px; }
.title { font-size: 13px; color: #e5c378; margin-top: 6px; }
</style></head><body><h1>Target Meratto Photos</h1><div class='grid'>"""

for t in targets:
    p = os.path.join('temp_cache_all', t)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        html += f"""<div class='card'>
            <img src='temp_cache_all/{t}' />
            <div class='title'>{t} ({w}x{h})</div>
        </div>"""

html += "</div></body></html>"
with open('target_gallery.html', 'w', encoding='utf-8') as out:
    out.write(html)
print("Saved target_gallery.html!")
