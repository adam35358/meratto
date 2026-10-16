import re, os
from PIL import Image

with open('WEB/src/data/products.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = list(re.finditer(r'id:\s*"([^"]+)".*?code:\s*"([^"]+)".*?category:\s*"([^"]+)".*?image:\s*"([^"]+)"', text, re.DOTALL))
print(f"Total products: {len(matches)}")
for i, m in enumerate(matches, 1):
    pid, code, cat, img = m.group(1), m.group(2), m.group(3), m.group(4)
    path = os.path.join('WEB/public', img.lstrip('/'))
    if os.path.exists(path):
        im = Image.open(path)
        w, h = im.size
        sz = os.path.getsize(path) // 1024
        ratio = round(w / h, 2)
        print(f"{i:02d} [{code}] ({cat}): {img} -> {w}x{h} (ratio {ratio}, {sz}KB)")
    else:
        print(f"{i:02d} [{code}] ({cat}): {img} -> *** MISSING ***")
