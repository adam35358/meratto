from PIL import Image
import os

os.makedirs("pants_crops_test", exist_ok=True)

# 1. f_0003d0 (1920x2535): Charcoal trousers
im_d0 = Image.open("temp_cache_all/f_0003d0.jpg")
w, h = im_d0.size
# Trousers hanger is at x approx 850..1500, y approx 200..2000
# Target 3:4 ratio: height = 1800, width = 1350
# Let's crop from x=750 to 1850 (width 1100), height = 1100 * 4/3 = 1466, or height=1800, width=1350
crop_d0 = im_d0.crop((750, 150, 1850, 1616)) # 1100 x 1466 -> ratio 0.75
crop_d0.resize((1200, 1600), Image.Resampling.LANCZOS).save("pants_crops_test/pants_d0_charcoal.jpg", quality=95)

# 2. f_0003cf (1920x2535): Black/Dark trousers
im_cf = Image.open("temp_cache_all/f_0003cf.jpg")
crop_cf = im_cf.crop((750, 150, 1850, 1616))
crop_cf.resize((1200, 1600), Image.Resampling.LANCZOS).save("pants_crops_test/pants_cf_black.jpg", quality=95)

# 3. f_000251 (1215x2160): Camel trousers
im_251 = Image.open("temp_cache_all/f_000251.jpg")
# In 1215-wide image, right rack is from x=550 to 1215 (width 665). Height = 665 * 4/3 = 886. Or taller:
# Let's see trousers height: from y=250 to 1800. Height=1400. Width=1050 (from x=165 to 1215)
crop_251 = im_251.crop((450, 180, 1215, 1200)) # width 765, height 1020 (ratio 0.75)
crop_251.resize((1200, 1600), Image.Resampling.LANCZOS).save("pants_crops_test/pants_251_camel.jpg", quality=95)

# 4. f_000250 (1215x2160): Navy trousers
im_250 = Image.open("temp_cache_all/f_000250.jpg")
crop_250 = im_250.crop((450, 180, 1215, 1200))
crop_250.resize((1200, 1600), Image.Resampling.LANCZOS).save("pants_crops_test/pants_250_navy.jpg", quality=95)

# 5. f_000403 (1217x2160): Dark Indigo Denim on Mannequin
im_403 = Image.open("temp_cache_all/f_000403.jpg")
# Mannequin legs wearing denim jeans: y from 900 to 2000
# Height 1100, width = 1100 * 3/4 = 825. Center x = 600 -> x from 187 to 1012
crop_403 = im_403.crop((187, 850, 1012, 1950))
crop_403.resize((1200, 1600), Image.Resampling.LANCZOS).save("pants_crops_test/pants_403_denim.jpg", quality=95)

print("Saved test pants crops!")
