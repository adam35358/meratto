import os
from PIL import Image

out_dir = 'WEB/public/images/products'
os.makedirs(out_dir, exist_ok=True)

def crop_fill_3_4(src_path, out_name, cx_ratio, cy_ratio, scale_factor=0.7):
    """Crop around (cx, cy) with exact 3:4 aspect ratio that fills the frame without any letterboxing/bars"""
    im = Image.open(src_path).convert("RGB")
    w, h = im.size
    
    # Target 3:4 ratio: w = h * 0.75
    # Determine maximum possible 3:4 box around cx, cy
    box_h = int(h * scale_factor)
    box_w = int(box_h * 0.75)
    
    if box_w > w:
        box_w = w
        box_h = int(box_w / 0.75)
        
    cx = int(w * cx_ratio)
    cy = int(h * cy_ratio)
    
    x1 = max(0, cx - box_w // 2)
    x2 = min(w, x1 + box_w)
    if x2 - x1 < box_w:
        x1 = max(0, x2 - box_w)
        
    y1 = max(0, cy - box_h // 2)
    y2 = min(h, y1 + box_h)
    if y2 - y1 < box_h:
        y1 = max(0, y2 - box_h)
        
    cropped = im.crop((x1, y1, x2, y2))
    resized = cropped.resize((1200, 1600), Image.Resampling.LANCZOS)
    out_path = os.path.join(out_dir, out_name)
    resized.save(out_path, quality=95)
    print(f"Generated perfect 3:4: {out_name} from {os.path.basename(src_path)} (box: {x1},{y1} to {x2},{y2})")

# 1. SHOES (No black bars, pure high-end boutique display filling 3:4)
# P26: Gabbacci Brown Suede Sneakers + Box
crop_fill_3_4("temp_cache_all/f_0003cf.jpg", "prod_shoes_leather_loafers.jpg", 0.35, 0.82, scale_factor=0.45)

# P27: Gabbacci Black Suede Sneakers + Box
crop_fill_3_4("temp_cache_all/f_0003d0.jpg", "product_12.jpg", 0.35, 0.82, scale_factor=0.45)

# P28: Brunello Cucinelli White Sneakers on Wood Shelf
crop_fill_3_4("temp_cache_all/f_0002c8.jpg", "prod_shoes_grey_casual.jpg", 0.50, 0.85, scale_factor=0.38)

# P29: Loro Piana Navy Knit Designer Sneakers on Floor
crop_fill_3_4("temp_cache_all/f_000269.jpg", "prod_shoes_navy_sneakers.jpg", 0.18, 0.90, scale_factor=0.35)

# 2. PANTS (Full tailored trousers on rack from hanger to bottom, zero black bars)
# P16: Loro Piana Navy Pinstripe Trousers
crop_fill_3_4("temp_cache_all/f_000269.jpg", "real_pants_denim_dark.jpg", 0.65, 0.45, scale_factor=0.88)

# P17: Meratto Camel Twill Chinos
crop_fill_3_4("temp_cache_all/f_000251.jpg", "real_pants_chinos_beige.jpg", 0.65, 0.45, scale_factor=0.88)

# P18: Falconeri Charcoal Wool Trousers with Brand Tag
crop_fill_3_4("temp_cache_all/f_0003d0.jpg", "real_pants_wool_trousers.jpg", 0.62, 0.45, scale_factor=0.85)

# P19: Fioroni Navy Tailored Trousers
crop_fill_3_4("temp_cache_all/f_000250.jpg", "real_pants_jeans_wash.jpg", 0.65, 0.45, scale_factor=0.88)

# P20: Taupe Melange Wool Joggers
crop_fill_3_4("temp_cache_all/f_0002bd.jpg", "real_pants_chinos_grey.jpg", 0.65, 0.45, scale_factor=0.88)

# 3. ACCESSORIES (No black bars, clean boutique accessories)
# P30: Loro Piana 100% Cashmere Baseball Cap
crop_fill_3_4("temp_cache_all/f_000409.jpg", "prod_accessory_baseball_cap.jpg", 0.18, 0.15, scale_factor=0.35)

# P31: Gabbacci Milano Branded Packaging Box & Pedestal
crop_fill_3_4("temp_cache_all/f_0003cf.jpg", "prod_accessory_red_necktie.jpg", 0.35, 0.72, scale_factor=0.40)

# P32: Boutique Luxury Perfume Collection
crop_fill_3_4("temp_cache_all/f_000249.jpg", "product_19.jpg", 0.12, 0.42, scale_factor=0.35)

print("Perfect crops completed!")
