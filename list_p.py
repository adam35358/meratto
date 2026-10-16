import re

with open('WEB/src/data/products.js', 'r', encoding='utf-8') as f:
    content = f.read()

matches = list(re.finditer(r'id:\s*"([^"]+)".*?code:\s*"([^"]+)".*?category:\s*"([^"]+)".*?image:\s*"([^"]+)"', content, re.DOTALL))
print(f'Total products: {len(matches)}')
for i, m in enumerate(matches, 1):
    print(f'{i}: id={m.group(1)} | code={m.group(2)} | cat={m.group(3)} | img={m.group(4)}')
