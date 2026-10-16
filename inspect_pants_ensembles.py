from PIL import Image
import os

images = {
    'f_000250': 'temp_cache_all/f_000250.jpg',
    'f_000251': 'temp_cache_all/f_000251.jpg',
    'f_000252': 'temp_cache_all/f_000252.jpg',
    'f_000253': 'temp_cache_all/f_000253.jpg',
    'f_000269': 'temp_cache_all/f_000269.jpg',
    'f_00028e': 'temp_cache_all/f_00028e.jpg',
    'f_0002ba': 'temp_cache_all/f_0002ba.jpg',
    'f_0002bd': 'temp_cache_all/f_0002bd.jpg',
    'f_0002c8': 'temp_cache_all/f_0002c8.jpg',
    'f_0003cf': 'temp_cache_all/f_0003cf.jpg',
    'f_0003d0': 'temp_cache_all/f_0003d0.jpg',
}

html = """<!DOCTYPE html><html><head><style>
body { background: #111; color: #fff; font-family: monospace; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px; }
.card { background: #222; padding: 10px; border-radius: 8px; text-align: center; }
img { width: 100%; height: 400px; object-fit: contain; }
</style></head><body>"""

for name, p in images.items():
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        # Let's crop right 60% of image where trousers and shoes are located
        right_crop = im.crop((int(w * 0.4), 0, w, h))
        out_p = f"test_crops/inspect_right_{name}.jpg"
        right_crop.save(out_p)
        html += f"""<div class="card">
            <img src="{out_p}">
            <p><b>{name} (Right Side)</b><br>{w}x{h}</p>
        </div>"""

html += "</body></html>"
with open("pants_inspection.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Saved pants_inspection.html")
