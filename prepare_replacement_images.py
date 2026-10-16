import os
from PIL import Image

out_dir = 'WEB/public/images/products'
os.makedirs(out_dir, exist_ok=True)

# 1. Prepare clean images for the cards the user highlighted:
# Let's inspect the sources from temp_cache_all:
# - f_000304.jpg (1080x1440) -> real_woufx_jacket_navy.jpg (Full complete navy tailored jacket)
# - f_000305.jpg (1080x1440) -> real_woufx_jacket_olive.jpg (Full complete olive/brown luxury jacket)
# - f_000306.jpg (1080x1440) -> real_woufx_dvoyka_wine.jpg (Full complete wine/bordeaux dvoyka set)
# - f_0003cf.jpg (1920x2535) -> real_woufx_look_editorial1.jpg (Full studio model editorial outfit)
# - f_0003d0.jpg (1920x2535) -> real_woufx_look_editorial2.jpg (Full studio model editorial outfit 2)
# - f_000298.jpg (1200x1088) -> real_woufx_flatlay_outfit.jpg (Full complete flat lay outfit)
# - f_0002e9.jpg (3072x4096) -> real_woufx_knit_navy.jpg (Full complete navy knitwear)

def save_optimized(src_path, out_name, max_w=1200, max_h=1600):
    if not os.path.exists(src_path):
        print("Missing:", src_path)
        return
    im = Image.open(src_path).convert('RGB')
    w, h = im.size
    # Fit into max_w x max_h preserving aspect ratio
    im.thumbnail((max_w, max_h), Image.LANCZOS)
    out_path = os.path.join(out_dir, out_name)
    im.save(out_path, 'JPEG', quality=92, optimize=True)
    print(f"Saved: {out_name} ({im.size[0]}x{im.size[1]}, {os.path.getsize(out_path)//1024}KB)")

# Process new real Instagram shots:
save_optimized('temp_cache_all/f_000304.jpg', 'real_woufx_jacket_navy.jpg')
save_optimized('temp_cache_all/f_000305.jpg', 'real_woufx_jacket_olive.jpg')
save_optimized('temp_cache_all/f_000306.jpg', 'real_woufx_dvoyka_wine.jpg')
save_optimized('temp_cache_all/f_0003cf.jpg', 'real_woufx_look_editorial1.jpg')
save_optimized('temp_cache_all/f_0003d0.jpg', 'real_woufx_look_editorial2.jpg')
save_optimized('temp_cache_all/f_000298.jpg', 'real_woufx_flatlay_outfit.jpg')
save_optimized('temp_cache_all/f_0002e9.jpg', 'real_woufx_knit_navy.jpg')

print("Replacement Instagram images prepared successfully!")
