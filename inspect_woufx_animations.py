import urllib.request
import re

url = 'https://woufx.com/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
except Exception as e:
    print("Error fetching HTML:", e)
    html = ""

css_files = re.findall(r'href="([^"]+\.css)"', html)
js_files = re.findall(r'src="([^"]+\.js)"', html)
print('CSS:', css_files)
print('JS:', js_files)

for c in css_files:
    c_url = c if c.startswith('http') else 'https://woufx.com' + c
    try:
        with urllib.request.urlopen(urllib.request.Request(c_url, headers={'User-Agent': 'Mozilla/5.0'})) as resp:
            css_text = resp.read().decode('utf-8', errors='ignore')
            keyframes = re.findall(r'@keyframes\s+([a-zA-Z0-9_\-]+)\s*\{', css_text)
            print('Keyframes in CSS:', set(keyframes))
    except Exception as e:
        print("CSS fetch error:", e)

for j in js_files:
    j_url = j if j.startswith('http') else 'https://woufx.com' + j
    try:
        with urllib.request.urlopen(urllib.request.Request(j_url, headers={'User-Agent': 'Mozilla/5.0'})) as resp:
            js_text = resp.read().decode('utf-8', errors='ignore')
            print('JS length:', len(js_text))
            # Check for animation libraries
            for lib in ['three', 'canvas', 'framer-motion', 'gsap', 'lenis', 'locomotive', 'spline', 'webgl', 'perspective', 'translate3d']:
                matches = len(re.findall(lib, js_text, re.IGNORECASE))
                print(f"Match '{lib}': {matches}")
    except Exception as e:
        print("JS fetch error:", e)
