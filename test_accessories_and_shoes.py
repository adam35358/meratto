import os
from PIL import Image

out_dir = "WEB/public/images/products"

def make_clean_crop(src_path, out_name, box, target_w=1200, target_h=1600):
    im = Image.open(src_path).convert("RGB")
    cropped = im.crop(box)
    w, h = cropped.size
    target_ratio = target_w / target_h # 0.75
    # Expand or crop to exact 3:4 without black bars
    current_ratio = w / h
    if current_ratio > target_ratio:
        # crop width to center
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        cropped = cropped.crop((offset, 0, offset + new_w, h))
    else:
        # crop height to center
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        cropped = cropped.crop((0, offset, w, offset + new_h))
    
    final = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    out_path = os.path.join(out_dir, out_name)
    final.save(out_path, quality=95)
    print(f"Generated clean {out_name} from {os.path.basename(src_path)}")

# 1. Shoes 3: White Cucinelli Sneakers (f_0002c8: 2268x3024)
# Shelf is at bottom, shoes are at x: 250..1500, y: 1800..3024
make_clean_crop("temp_cache_all/f_0002c8.jpg", "prod_shoes_grey_casual.jpg", (100, 1500, 1600, 3024))

# 2. Shoes 4: Navy Knit Designer Sneakers (f_000269: 2268x3024)
# Shoes are at x: 650..1650, y: 1900..3024
make_clean_crop("temp_cache_all/f_000269.jpg", "prod_shoes_navy_sneakers.jpg", (600, 1800, 1700, 3024))

# 3. Acc 1: Navy Cashmere Cap (f_000409: 3024x4032)
make_clean_crop("temp_cache_all/f_000409.jpg", "prod_accessory_baseball_cap.jpg", (50, 200, 800, 1200))

# 4. Acc 2: Light Grey Cashmere Cap (f_000409: 3024x4032)
# Top right shelf has the light grey cap: x: 1950..2750, y: 350..1150
make_clean_crop("temp_cache_all/f_000409.jpg", "prod_accessory_red_necktie.jpg", (1900, 250, 2800, 1300))

# 5. Acc 3: Charcoal Cashmere Cap on Mannequin (f_000409: 3024x4032)
# Center mannequin head: x: 1200..1850, y: 150..1100
make_clean_crop("temp_cache_all/f_000409.jpg", "product_19.jpg", (1100, 100, 1950, 1200))

print("All accessory and shoe clean crops generated successfully!")
