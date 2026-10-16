import os
from PIL import Image

# Let's inspect specific candidate files and save 400x533 thumbnails in a test folder
os.makedirs('temp_thumbnails', exist_ok=True)

test_files = [
    'temp_cache_all/f_00040a.jpg',
    'temp_cache_all/f_000409.jpg',
    'temp_cache_all/f_000303.jpg',
    'temp_cache_all/f_0002e9.jpg',
    'temp_cache_all/f_0002e3.jpg',
    'temp_cache_all/f_0002e4.jpg',
    'temp_cache_all/f_0002dd.jpg',
    'temp_cache_all/f_0002d7.jpg',
    'temp_cache_all/f_0002af.jpg',
    'temp_cache_all/f_0002b0.jpg',
    'temp_cache_all/f_00024a.jpg',
    'temp_cache_all/f_000269.jpg',
    'temp_cache_all/f_00029c.jpg',
    'temp_cache_all/f_0002a4.jpg',
    'temp_cache_all/f_0002e1.jpg',
    'temp_cache_all/f_0002e6.jpg',
    'temp_cache_all/f_000418.jpg',
    'temp_cache_all/f_000417.jpg',
    'temp_cache_all/f_000415.jpg',
    'temp_cache_all/f_000407.jpg',
    'temp_cache_all/f_000403.jpg',
    'temp_cache_all/f_000298.jpg',
    'temp_cache_all/f_000304.jpg',
    'temp_cache_all/f_000305.jpg',
    'temp_cache_all/f_000306.jpg',
    'temp_cache_all/f_0003cf.jpg',
    'temp_cache_all/f_0003d0.jpg',
    'temp_cache_images/f_0001dd.jpg',
    'temp_cache_images/f_0001fe.jpg',
    'temp_cache_images/f_0001f9.jpg',
    'temp_cache_images/f_0001fd.jpg',
]

for p in test_files:
    if os.path.exists(p):
        name = os.path.basename(p)
        im = Image.open(p).convert('RGB')
        im.thumbnail((400, 533))
        im.save(f'temp_thumbnails/{name}', 'JPEG', quality=85)

print(f"Generated {len(test_files)} thumbnails in temp_thumbnails")
