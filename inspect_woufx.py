import urllib.request
import re

js_url = 'https://woufx.com/assets/main-CUC65r0o.js'
req = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8', errors='ignore')

# Extract key UI design tokens:
print("Length of bundle:", len(content))

# Look for text strings, navigation, hero, typography
strings = re.findall(r'"([A-Z][a-zA-Z0-9\s—\-\.]{4,40})"', content)
print("\nSample strings from WOUFX:")
for s in strings[:40]:
    if any(k in s.lower() for k in ['market', 'liquidity', 'trade', 'broker', 'bank', 'platform', 'execution', 'spread', 'account', 'security']):
        print(" ->", s)

# Look for prominent layout styling
cards = re.findall(r'class(?:Name)?:\s*"([^"]*(?:rounded|backdrop|border|glass|gradient)[^"]*)"', content)
print(f"\nFound {len(cards)} styled elements, sample:")
for c in cards[:15]:
    print(" ->", c)
