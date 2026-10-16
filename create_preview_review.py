import os
from PIL import Image

# Build comparison HTML
html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Product Candidates Review</title>
<style>
  body { background: #0a0c10; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; }
  h1, h2 { color: #f59e0b; margin-top: 30px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .card { background: #131722; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
  .img-box { height: 350px; background: #000; display: flex; align-items: center; justify-content: center; }
  img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .info { padding: 12px; font-size: 13px; }
  .title { font-weight: 600; color: #38bdf8; margin-bottom: 4px; }
  .sub { color: #94a3b8; font-size: 11px; }
</style>
</head>
<body>
<h1>Product Candidates Visual Review</h1>
"""

sections = {
    "Pants (test_crops)": [
        ("test_crops/p16_pinstripe_navy.jpg", "P16 Pinstripe Navy Trousers"),
        ("test_crops/p17_twill_camel.jpg", "P17 Twill Camel Chinos"),
        ("test_crops/p18_falconeri_charcoal.jpg", "P18 Falconeri Charcoal Wool Trousers"),
        ("test_crops/p19_fioroni_navy.jpg", "P19 Fioroni Navy Tailored Pants"),
        ("test_crops/p20_taupe_wool.jpg", "P20 Taupe Wool Joggers"),
        ("WEB/public/images/products/real_pants_denim_dark.jpg", "Real Pants Denim Dark (Existing)"),
        ("WEB/public/images/products/real_pants_chinos_beige.jpg", "Real Pants Chinos Beige (Existing)"),
        ("WEB/public/images/products/real_pants_wool_trousers.jpg", "Real Pants Wool Trousers (Existing)")
    ],
    "Shoes Candidates": [
        ("test_crops/shoes_gabbacci_brown.jpg", "Gabbacci Brown Suede Shoes & Box"),
        ("test_crops/shoes_gabbacci_black.jpg", "Gabbacci Black Suede Shoes & Box"),
        ("test_crops/shoes_cucinelli_white.jpg", "Brunello Cucinelli White Sneakers"),
        ("test_crops/shoes_navy_knit.jpg", "Navy Knit Designer Sneakers"),
        ("WEB/public/images/products/real_shoes_leather_brown.jpg", "Real Shoes Leather Brown (Existing)"),
        ("WEB/public/images/products/real_shoes_white_casual.jpg", "Real Shoes White Casual (Existing)"),
        ("WEB/public/images/products/real_shoes_navy_sneakers.jpg", "Real Shoes Navy Sneakers (Existing)")
    ],
    "Accessories Candidates": [
        ("WEB/public/images/products/real_accessory_wool_cap.jpg", "Real Wool Cap"),
        ("temp_cache_all/f_000409.jpg", "f_000409 Loro Piana Caps Display"),
        ("temp_cache_all/f_000249.jpg", "f_000249 Boutique Perfume Display"),
        ("temp_cache_all/f_0003cf.jpg", "f_0003cf Gabbacci Luxury Box"),
        ("temp_cache_all/f_000298.jpg", "f_000298 Flatlay Accessories & Look")
    ],
    "Knitwear & Shirts Candidates": [
        ("temp_cache_all/f_00040a.jpg", "f_00040a Cashmere Cardigan / Knitwear"),
        ("temp_cache_all/f_0002e9.jpg", "f_0002e9 Navy Knitwear"),
        ("WEB/public/images/products/real_knit_cashmere_cardigan.jpg", "Real Knit Cashmere Cardigan"),
        ("WEB/public/images/products/real_polo_merino_burgundy.jpg", "Real Polo Merino Burgundy"),
        ("WEB/public/images/products/real_polo_merino_navy.jpg", "Real Polo Merino Navy"),
        ("temp_cache_all/f_000403.jpg", "f_000403 White Waffle Knit & Leather Bomber"),
        ("temp_cache_all/f_00024a.jpg", "f_00024a Mannequins under Meratto Sign")
    ]
}

for sec_title, items in sections.items():
    html += f"<h2>{sec_title}</h2><div class='grid'>"
    for p, title in items:
        if os.path.exists(p):
            im = Image.open(p)
            w, h = im.size
            sz = os.path.getsize(p) // 1024
            html += f"""
            <div class="card">
              <div class="img-box"><img src="{p.replace(chr(92), '/')}" loading="lazy"></div>
              <div class="info">
                <div class="title">{title}</div>
                <div class="sub">{os.path.basename(p)} &bull; {w}x{h} &bull; {sz}KB &bull; ratio {round(w/h, 2)}</div>
              </div>
            </div>
            """
    html += "</div>"

html += "</body></html>"

with open('preview_review.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved preview_review.html")
