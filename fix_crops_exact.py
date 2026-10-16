import os
from PIL import Image

def crop_exact(src_path, out_path, box, target_w=1200, target_h=1600):
    im = Image.open(src_path).convert("RGB")
    cropped = im.crop(box)
    w, h = cropped.size
    target_ratio = target_w / target_h
    # Pad to exact 3:4 if needed
    if abs(w/h - target_ratio) > 0.01:
        if w/h > target_ratio:
            new_h = int(w / target_ratio)
            new_im = Image.new("RGB", (w, new_h), (12, 14, 18))
            new_im.paste(cropped, (0, (new_h - h)//2))
            cropped = new_im
        else:
            new_w = int(h * target_ratio)
            new_im = Image.new("RGB", (new_w, h), (12, 14, 18))
            new_im.paste(cropped, ((new_w - w)//2, 0))
            cropped = new_im
    resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    resized.save(out_path, quality=95)
    print(f"Saved: {out_path} ({resized.size})")

out_dir = "WEB/public/images/products"

# 1. White Brunello Cucinelli Sneakers (f_0002c8: 2268x3024)
# Shoes are at x: 200..1500, y: 1900..3024
crop_exact("temp_cache_all/f_0002c8.jpg", f"{out_dir}/prod_shoes_grey_casual.jpg", (150, 1900, 1500, 3024))

# 2. Navy Designer Sneakers (f_000269: 2268x3024)
# In f_000269, shoes are at x: 800..1500, y: 2200..3024
crop_exact("temp_cache_all/f_000269.jpg", f"{out_dir}/prod_shoes_navy_sneakers.jpg", (750, 2200, 1550, 3024))

# 3. Loro Piana Cashmere Baseball Cap (f_000409: 3024x4032)
# Cap on top-left shelf: x: 80..650, y: 350..1050
crop_exact("temp_cache_all/f_000409.jpg", f"{out_dir}/prod_accessory_baseball_cap.jpg", (60, 320, 680, 1140))

# 4. Gabbacci Milano Luxury Box & Pedestal (f_0003cf: 1920x2535)
crop_exact("temp_cache_all/f_0003cf.jpg", f"{out_dir}/prod_accessory_red_necktie.jpg", (100, 1350, 1350, 2520))

# 5. Boutique Luxury Fragrance / Perfume (f_000249: 720x1280)
# Counter bottles on left: x: 0..120, y: 460..600 -> let's crop with surrounding luxury wooden counter
crop_exact("temp_cache_all/f_000249.jpg", f"{out_dir}/product_19.jpg", (0, 420, 200, 680))

print("Fixed crops completed!")
