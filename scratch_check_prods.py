import os, re
from PIL import Image

with open('WEB/src/data/products.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_prod = {}
prods = []
for line in lines:
    m_id = re.search(r'id:\s*"([^"]+)"', line)
    if m_id:
        if current_prod:
            prods.append(current_prod)
        current_prod = {'id': m_id.group(1)}
    m_code = re.search(r'code:\s*"([^"]+)"', line)
    if m_code and 'code' not in current_prod:
        current_prod['code'] = m_code.group(1)
    m_cat = re.search(r'category:\s*"([^"]+)"', line)
    if m_cat and 'cat' not in current_prod:
        current_prod['cat'] = m_cat.group(1)
    m_img = re.search(r'image:\s*"([^"]+)"', line)
    if m_img and 'img' not in current_prod:
        current_prod['img'] = m_img.group(1)
if current_prod:
    prods.append(current_prod)

print(f"Total products found: {len(prods)}")
for p in prods:
    img_rel = p.get('img', '').lstrip('/')
    img_path = os.path.join('WEB/public', img_rel)
    exists = os.path.exists(img_path)
    size_str = "MISSING"
    if exists:
        try:
            im = Image.open(img_path)
            size_str = f"{im.size[0]}x{im.size[1]}"
        except Exception as e:
            size_str = f"ERROR: {e}"
    print(f"{p.get('code'):<12} | {p.get('cat'):<12} | {img_rel:<42} | Exists: {str(exists):<5} | {size_str}")
