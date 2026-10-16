import os
from PIL import Image

# Let's inspect the files in WEB/public/images/products:
files = os.listdir('WEB/public/images/products')
print(f"Total files in products dir: {len(files)}")

# Check original product_1 to 25
descriptions = {
    "product_1.jpg": "Suit / Jacket",
    "product_2.jpg": "Brown suit",
    "product_3.jpg": "White Oxford Shirt on mannequin",
    "product_4.jpg": "Navy Shirt on hanger",
    "product_5.jpg": "Beige Cardigan knitwear",
    "product_6.jpg": "Ribbed grey knitwear",
    "product_7.jpg": "Polo shirt on hanger",
    "product_8.jpg": "Polo shirt folded/detail",
    "product_9.jpg": "Leather bomber",
    "product_10.jpg": "Suede blue jacket",
    "product_11.jpg": "Jeans / Pants",
    "product_12.jpg": "Shoes / Loafers",
    "product_13.jpg": "Shoes / Sneakers",
    "product_14.jpg": "Suit set",
    "product_15.jpg": "Pants / Chinos",
    "product_16.jpg": "Jacket / Aviator",
    "product_17.jpg": "Pants",
    "product_18.jpg": "Pants",
    "product_19.jpg": "Belt / Wallet accessory",
    "product_20.jpg": "Wallet / Perfume accessory",
    "product_21.jpg": "Shoes",
    "product_22.jpg": "Shoes",
    "product_23.jpg": "Pants",
    "product_24.jpg": "Pants",
    "product_25.jpg": "Tie / Accessory"
}

for k, v in descriptions.items():
    p = os.path.join('WEB/public/images/products', k)
    if os.path.exists(p):
        im = Image.open(p)
        print(f"{k} ({im.size}): {v}")
