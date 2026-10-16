import re

with open('WEB/src/data/products.js', 'r', encoding='utf-8') as f:
    content = f.read()

products = re.findall(r'id:\s*"([^"]+)",\s*code:\s*"([^"]+)",\s*category:\s*"([^"]+)",[\s\S]*?name:\s*\{\s*uz:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"', content)

print(f"Total products in products.js: {len(products)}")
for p in products:
    print(f"[{p[1]}] ({p[2]}) {p[3]} -> {p[4]}")
