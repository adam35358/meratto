import re

with open('woufx_bundle.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's find sections, layout items, navigation, and features
lines = code.split(';')
print("Total statements in WOUFX bundle:", len(lines))

# Search for react components or JSX-like structures
# Look for aria-label, section, id=, className=
sections = re.findall(r'id:"([^"]+)"', code)
print("Sections IDs found:", set(sections))

classes = re.findall(r'className:"([^"]+)"', code)
styled_classes = set()
for c in classes:
    for item in c.split():
        if any(k in item for k in ['woufx', 'border', 'rounded', 'glass', 'panel', 'glow', 'grid', 'badge', 'btn', 'pill', 'mono']):
            styled_classes.add(item)

print(f"Sample styled classes ({len(styled_classes)}):", list(styled_classes)[:35])
