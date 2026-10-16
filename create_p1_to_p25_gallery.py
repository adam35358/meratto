import os
from PIL import Image

html = """<!DOCTYPE html><html><head><style>
body { background: #111; color: #fff; font-family: monospace; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; padding: 20px; }
.card { background: #222; padding: 10px; border-radius: 8px; text-align: center; }
img { width: 100%; height: 350px; object-fit: contain; }
</style></head><body>"""

for i in range(1, 26):
    fn = f"product_{i}.jpg"
    p = os.path.join('WEB/public/images/products', fn)
    if os.path.exists(p):
        html += f"""<div class="card">
            <img src="{p}">
            <p><b>{fn}</b></p>
        </div>"""

html += "</body></html>"
with open("product_1_to_25.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Saved product_1_to_25.html")
