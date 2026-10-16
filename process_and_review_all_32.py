import os
from PIL import Image, ImageOps

out_dir = 'WEB/public/images/products'
os.makedirs(out_dir, exist_ok=True)

def fit_to_3_4(im, target_w=1200, target_h=1600, bg_color=(12, 14, 18)):
    w, h = im.size
    target_ratio = target_w / target_h # 0.75
    current_ratio = w / h
    
    if abs(current_ratio - target_ratio) < 0.02:
        return im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    elif current_ratio > target_ratio:
        # Wider than 3:4: pad top/bottom
        new_h = int(w / target_ratio)
        new_im = Image.new("RGB", (w, new_h), bg_color)
        new_im.paste(im, (0, (new_h - h) // 2))
        return new_im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    else:
        # Taller than 3:4: pad left/right
        new_w = int(h * target_ratio)
        new_im = Image.new("RGB", (new_w, h), bg_color)
        new_im.paste(im, ((new_w - w) // 2, 0))
        return new_im.resize((target_w, target_h), Image.Resampling.LANCZOS)

def crop_exact(src_path, out_name, x1, y1, x2, y2, target_w=1200, target_h=1600):
    im = Image.open(src_path).convert("RGB")
    cropped = im.crop((x1, y1, x2, y2))
    fitted = fit_to_3_4(cropped, target_w, target_h)
    out_path = os.path.join(out_dir, out_name)
    fitted.save(out_path, quality=95)
    print(f"Saved: {out_name} ({fitted.size})")

def resize_3_4(src_path, out_name, target_w=1200, target_h=1600):
    im = Image.open(src_path).convert("RGB")
    fitted = fit_to_3_4(im, target_w, target_h)
    out_path = os.path.join(out_dir, out_name)
    fitted.save(out_path, quality=95)
    print(f"Saved: {out_name} ({fitted.size})")

print("Processing 32 products...")

# 1. DVOYKA (1 to 6)
resize_3_4("temp_cache_all/f_000250.jpg", "real_dvoyka_sportchic_navy.jpg")
resize_3_4("temp_cache_all/f_0002c8.jpg", "real_dvoyka_burgundy.jpg")
resize_3_4("temp_cache_all/f_000269.jpg", "real_dvoyka_casual_navy.jpg")
resize_3_4("temp_cache_all/f_0003d0.jpg", "real_dvoyka_boutique_duo.jpg")
resize_3_4("temp_cache_all/f_0003cf.jpg", "real_dvoyka_pinstripe_navy.jpg") # Gabbacci black look
resize_3_4("temp_cache_all/f_000306.jpg", "real_woufx_dvoyka_wine.jpg")

# 2. JACKETS & VESTS (7 to 15)
resize_3_4("temp_cache_all/f_000303.jpg", "real_jacket_cucinelli_wool.jpg") # Berluti luxury rib
resize_3_4("temp_cache_all/f_0002b0.jpg", "real_jacket_loropiana_shearling.jpg")
resize_3_4("temp_cache_all/f_0002c6.jpg", "real_jacket_loropiana_suede.jpg")
resize_3_4("temp_cache_all/f_0002d7.jpg", "real_jacket_tomford_suede.jpg")
resize_3_4("temp_cache_all/f_0002af.jpg", "real_jacket_hybrid_navy.jpg")
resize_3_4("temp_cache_all/f_000305.jpg", "real_woufx_jacket_olive.jpg")
resize_3_4("temp_cache_all/f_0001dd.jpg", "real_vest_navy_puffer.jpg")
resize_3_4("temp_cache_all/f_000418.jpg", "real_vest_quilted_gilet.jpg") # MooRER fur
resize_3_4("temp_cache_all/f_000302.jpg", "real_woufx_jacket_navy.jpg") # Loro Piana aviator

# 3. PANTS (16 to 20) - PURE TROUSERS ON RACK WITH SHOES BELOW
# P16: Navy Pinstripe Trousers from f_000269 (2268x3024)
crop_exact("temp_cache_all/f_000269.jpg", "real_pants_denim_dark.jpg", 750, 100, 2268, 2900)

# P17: Camel Twill Trousers from f_000251 (1215x2160)
crop_exact("temp_cache_all/f_000251.jpg", "real_pants_chinos_beige.jpg", 400, 150, 1215, 2100)

# P18: Charcoal Wool Trousers with Falconeri tag from f_0003d0 (1920x2535)
crop_exact("temp_cache_all/f_0003d0.jpg", "real_pants_wool_trousers.jpg", 750, 120, 1920, 2450)

# P19: Fioroni Navy Trousers from f_000250 (1215x2160)
crop_exact("temp_cache_all/f_000250.jpg", "real_pants_jeans_wash.jpg", 380, 150, 1215, 2100)

# P20: Taupe Melange Wool Joggers from f_0002bd (1215x2160)
crop_exact("temp_cache_all/f_0002bd.jpg", "real_pants_chinos_grey.jpg", 380, 150, 1215, 2100)

# 4. POLO & KNITWEAR (21 to 25)
# P21: Burgundy Polo (preserve current real_polo_merino_burgundy.jpg)
# P22: Cashmere Cardigan from f_00040a (3072x4096)
resize_3_4("temp_cache_all/f_00040a.jpg", "real_knit_cashmere_cardigan.jpg")
# P23: Navy Polo (preserve current real_polo_merino_navy.jpg)
# P24: Navy Textured Sweater from f_0002e9 (3072x4096)
resize_3_4("temp_cache_all/f_0002e9.jpg", "real_woufx_knit_navy.jpg")
# P25: Luxury Mannequin Look / Shirt from f_00024a (1320x1760)
resize_3_4("temp_cache_all/f_00024a.jpg", "product_3.jpg")

# 5. SHOES (26 to 29) - PURE FOOTWEAR
# P26: Gabbacci Brown Suede Sneakers with Branded Box from f_0003cf (1920x2535)
crop_exact("temp_cache_all/f_0003cf.jpg", "prod_shoes_leather_loafers.jpg", 30, 1750, 1300, 2520)

# P27: Gabbacci Black Suede Sneakers with Branded Box from f_0003d0 (1920x2535)
crop_exact("temp_cache_all/f_0003d0.jpg", "product_12.jpg", 30, 1750, 1300, 2520)

# P28: Brunello Cucinelli White Leather Sneakers from f_0002c8 (2268x3024)
crop_exact("temp_cache_all/f_0002c8.jpg", "prod_shoes_grey_casual.jpg", 250, 2300, 2150, 3020)

# P29: Loro Piana Navy Knit Designer Sneakers from f_000269 (2268x3024)
crop_exact("temp_cache_all/f_000269.jpg", "prod_shoes_navy_sneakers.jpg", 0, 2350, 1100, 3020)

# 6. ACCESSORIES (30 to 32)
# P30: Loro Piana 100% Cashmere Baseball Cap from f_000409 (3024x4032)
crop_exact("temp_cache_all/f_000409.jpg", "prod_accessory_baseball_cap.jpg", 0, 180, 1000, 1400)

# P31: Gabbacci Milano Luxury Branded Box & Pedestal from f_0003cf (1920x2535)
crop_exact("temp_cache_all/f_0003cf.jpg", "prod_accessory_red_necktie.jpg", 80, 1750, 950, 2400)

# P32: Boutique Luxury Perfume Collection from f_000249 (720x1280)
crop_exact("temp_cache_all/f_000249.jpg", "product_19.jpg", 0, 420, 280, 750)

print("All 32 product images successfully generated!")
