import os
from PIL import Image, ImageOps, ImageFilter

out_dir = 'WEB/public/images/products'
os.makedirs(out_dir, exist_ok=True)

def fit_to_3_4(im, target_w=1200, target_h=1600, bg_color=(10, 12, 16)):
    """Fit image into exact 3:4 ratio without distortion, padding with elegant dark boutique tone if needed"""
    w, h = im.size
    target_ratio = target_w / target_h # 0.75
    current_ratio = w / h
    
    if abs(current_ratio - target_ratio) < 0.02:
        # Already 3:4
        return im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    elif current_ratio > target_ratio:
        # Wider than 3:4: pad top/bottom
        new_h = int(w / target_ratio)
        new_im = Image.new("RGB", (w, new_h), bg_color)
        new_im.paste(im, (0, (new_h - h) // 2))
        return new_im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    else:
        # Taller than 3:4: pad left/right or crop
        new_w = int(h * target_ratio)
        new_im = Image.new("RGB", (new_w, h), bg_color)
        new_im.paste(im, ((new_w - w) // 2, 0))
        return new_im.resize((target_w, target_h), Image.Resampling.LANCZOS)

def crop_exact_3_4(im, x1_r, y1_r, x2_r, y2_r, target_w=1200, target_h=1600):
    w, h = im.size
    box = (int(w * x1_r), int(h * y1_r), int(w * x2_r), int(h * y2_r))
    crop = im.crop(box)
    return fit_to_3_4(crop, target_w, target_h)

print("Helper functions ready.")
