import os, glob
from PIL import Image

def analyze_all():
    all_files = glob.glob('temp_cache_all/*.jpg') + glob.glob('temp_cache_images/*.jpg') + glob.glob('WEB/public/images/products/*.jpg')
    seen_sizes = {}
    unique_images = []
    
    for f in all_files:
        try:
            sz = os.path.getsize(f)
            if sz < 40000: # skip tiny thumbnails
                continue
            im = Image.open(f)
            w, h = im.size
            if w < 400 or h < 400:
                continue
            key = (w, h, sz)
            if key in seen_sizes:
                continue
            seen_sizes[key] = f
            unique_images.append({
                'path': f.replace('\\', '/'),
                'name': os.path.basename(f),
                'w': w,
                'h': h,
                'sz': sz // 1024,
                'aspect': round(h / w, 2)
            })
        except Exception as e:
            pass

    print(f"Total unique high-res images found: {len(unique_images)}")
    
    # Sort by size descending
    unique_images.sort(key=lambda x: x['sz'], reverse=True)

    # Generate an HTML gallery to easily inspect and categorize
    html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Meratto High Res Assets</title>
<style>
body { background: #07080a; color: #fff; font-family: monospace; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.card { background: #11141a; border: 1px solid #222; border-radius: 12px; overflow: hidden; padding: 10px; }
img { width: 100%; height: 350px; object-fit: contain; background: #000; border-radius: 8px; }
.info { margin-top: 8px; font-size: 11px; color: #aaa; word-break: break-all; }
</style>
</head>
<body>
<h1>Meratto Assets Contact Sheet (""" + str(len(unique_images)) + """ images)</h1>
<div class="grid">
"""
    for img in unique_images:
        html += f"""
        <div class="card">
            <img src="{img['path']}" loading="lazy">
            <div class="info">
                <strong>{img['name']}</strong><br>
                {img['w']}x{img['h']} &bull; {img['sz']}KB &bull; AR: {img['aspect']}<br>
                Path: {img['path']}
            </div>
        </div>
        """
    html += """</div></body></html>"""
    
    with open('meratto_assets_contact_sheet.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Saved contact sheet to meratto_assets_contact_sheet.html")

if __name__ == '__main__':
    analyze_all()
