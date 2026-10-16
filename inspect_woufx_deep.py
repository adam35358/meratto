import re

with open('woufx_bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Find strings in double quotes
pattern = re.compile(r'"([^"\\]{8,100})"')
matches = pattern.findall(text)

keywords = [
    'liquidity', 'spread', 'execution', 'platform', 'terminal', 'pricing',
    'trading', 'access', 'technology', 'tier-1', 'order', 'market',
    'connect', 'infrastructure', 'speed', 'feed', 'institutional'
]

found = []
for m in matches:
    if any(k in m.lower() for k in keywords):
        if m not in found:
            found.append(m)

print(f"Total matching key strings: {len(found)}")
for item in found[:40]:
    print(" -", item)
