import os
from PIL import Image

cache = 'temp_cache_all'
files = [f for f in os.listdir(cache) if f.endswith(('.jpg', '.png'))]

html = ['<html><body style="background:#111;color:#eee;font-family:sans-serif;padding:20px;">', '<h2>Image Gallery</h2><div style="display:flex;flex-wrap:wrap;gap:15px;">']

for f in sorted(files):
    p = os.path.join(cache, f)
    try:
        w, h = Image.open(p).size
        abs_p = os.path.abspath(p).replace('\\', '/')
        html.append(f'<div style="width:220px;background:#222;padding:8px;border-radius:6px;text-align:center;"><img src="file:///{abs_p}" style="width:100%;height:220px;object-fit:cover;border-radius:4px;"><div style="font-size:11px;margin-top:6px;"><b>{f}</b><br>{w}x{h}</div></div>')
    except Exception as e:
        pass

html.append('</div></body></html>')
with open('image_gallery.html', 'w', encoding='utf-8') as f_out:
    f_out.write('\n'.join(html))
print('image_gallery.html written with', len(files), 'images')
