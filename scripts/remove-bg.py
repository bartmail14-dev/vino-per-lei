"""
Download all Shopify product images and remove backgrounds using rembg.
Outputs transparent PNGs to public/images/products/<handle>.png
"""

import json
import os
import sys
import urllib.request
import urllib.parse
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image
    from io import BytesIO
except ImportError:
    print("Missing dependencies. Run: pip install rembg Pillow")
    sys.exit(1)

# Config
DOMAIN = "vino-per-lei-2.myshopify.com"
TOKEN = "ded4b32a0bba7215c405301e3b57a764"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "images" / "products"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Fetch all products via Storefront API
query = """
{
  products(first: 50) {
    edges {
      node {
        handle
        title
        featuredImage {
          url
        }
      }
    }
  }
}
"""

print("Fetching products from Shopify...")
req = urllib.request.Request(
    f"https://{DOMAIN}/api/2026-01/graphql.json",
    data=json.dumps({"query": query}).encode(),
    headers={
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
    },
)

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read())

products = data["data"]["products"]["edges"]
print(f"Found {len(products)} products\n")

for edge in products:
    node = edge["node"]
    handle = node["handle"]
    title = node["title"]
    img_url = node.get("featuredImage", {}).get("url")

    if not img_url:
        print(f"  SKIP {handle} — no image")
        continue

    output_path = OUTPUT_DIR / f"{handle}.png"
    if output_path.exists():
        print(f"  SKIP {handle} — already processed")
        continue

    print(f"  Processing: {title} ({handle})...")

    # Download image
    with urllib.request.urlopen(img_url) as img_resp:
        img_data = img_resp.read()

    # Remove background
    result = remove(img_data)

    # Save as PNG with transparency
    img = Image.open(BytesIO(result))
    img.save(output_path, "PNG")
    print(f"    Saved: {output_path.name} ({img.size[0]}x{img.size[1]})")

print(f"\nDone! {len(list(OUTPUT_DIR.glob('*.png')))} images in {OUTPUT_DIR}")
