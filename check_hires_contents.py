import os
from PIL import Image

hires_files = [
    'f_00028a.jpg', 'f_00029b.jpg', 'f_00029c.jpg', 'f_0002a4.jpg',
    'f_0002e0.jpg', 'f_0002e1.jpg', 'f_0002e2.jpg', 'f_0002e3.jpg',
    'f_0002e4.jpg', 'f_0002e5.jpg', 'f_0002e6.jpg', 'f_0002ed.jpg'
]

html = """<!DOCTYPE html><html><head><style>
body { background: #111; color: #fff; font-family: sans-serif; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px; }
.card { background: #222; padding: 10px; border-radius: 8px; text-align: center; }
img { width: 100%; height: 380px; object-fit: contain; }
</style></head><body>"""

for fn in hires_files:
    p = os.path.join('temp_cache_all', fn)
    if os.path.exists(p):
        im = Image.open(p)
        html += f"""<div class="card">
            <img src="{p}">
            <p><b>{fn}</b><br>{im.size[0]}x{im.size[1]}</p>
        </div>"""

html += "</body></html>"
with open("hires_gallery.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Saved hires_gallery.html")
