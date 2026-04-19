#!/usr/bin/env python3
"""
Extract menu data from Meatown HTML page by parsing embedded JSON
"""

import json
import re
import requests
from datetime import datetime

URL = "https://orders.meatown.co.il/front/catering/1/2026-04-19"

CATEGORY_NAMES = {
    "26": "הנחות",
    "27": "בקר טרי",
    "28": "עוף טרי",
    "29": "בקר טרי",  # Website mislabels - actually contains beef
    "30": "עוף טרי",  # Website mislabels - actually contains chicken
    "31": "דגים",  # Website mislabels - actually contains fish
    "32": "מיוחדים מהפריזר",  # Website mislabels - freezer specials
    "33": "טחונים ונקניקיות",  # Website mislabels - ground meats & sausages
    "34": "המארזים של פנחס",
    "35": "סלטים ולחם",  # Website mislabels - salads and bread
    "36": "סופר פנחס",  # Additional products, sauces, spices, tools
    "38": "יין"  # Wine
}

def fetch_html():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    response = requests.get(URL, headers=headers)
    response.encoding = 'utf-8'
    return response.text

def extract_products(html):
    """Extract product data from embedded JSON in HTML"""
    products = []

    # Find all JSON objects that contain product data
    # Pattern: objects with "id", "name", "price", "category_id"

    # First, find the main data structure - usually in a <script> tag or inline
    # Look for patterns like: {"id":403,"name":"...","price":120,...}

    # Extract individual product patterns
    product_pattern = r'\{"id":(\d+),[^}]*"name":"([^"]+)"[^}]*"price":([0-9.]+)[^}]*"category_id":(\d+)[^}]*\}'

    matches = re.findall(product_pattern, html)

    seen_ids = set()
    for match in matches:
        prod_id, name, price, cat_id = match

        if prod_id in seen_ids:
            continue
        seen_ids.add(prod_id)

        # Decode unicode escapes
        try:
            name = name.encode().decode('unicode_escape')
        except:
            pass

        products.append({
            "id": prod_id,
            "name": name,
            "price": float(price),
            "category_id": cat_id
        })

    # Also try to find products in a different format
    # Sometimes they're in arrays
    alt_pattern = r'"id":(\d+),"name":"([^"]+)".*?"price":([0-9.]+).*?"category_id":(\d+)'

    for match in re.finditer(alt_pattern, html):
        prod_id = match.group(1)
        if prod_id in seen_ids:
            continue
        seen_ids.add(prod_id)

        name = match.group(2)
        try:
            name = name.encode().decode('unicode_escape')
        except:
            pass

        products.append({
            "id": prod_id,
            "name": name,
            "price": float(match.group(3)),
            "category_id": match.group(4)
        })

    return products

def organize_by_category(products):
    """Organize products into categories"""
    categories = {}

    for prod in products:
        cat_id = prod["category_id"]
        if cat_id not in categories:
            categories[cat_id] = {
                "name": CATEGORY_NAMES.get(cat_id, f"קטגוריה {cat_id}"),
                "id": cat_id,
                "items": []
            }

        categories[cat_id]["items"].append({
            "id": prod["id"],
            "name": prod["name"],
            "price": prod["price"],
            "unit": "ק״ג"  # Default unit
        })

    # Sort categories by ID and return as list
    return [categories[k] for k in sorted(categories.keys(), key=int)]

def save_results(categories):
    output = {
        "source": "meatown",
        "store_name": "פנחס הקצב",
        "url": URL,
        "scraped_at": datetime.now().isoformat(),
        "categories": categories
    }

    with open("data/meatown_menu.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("✓ Saved to data/meatown_menu.json")

def print_summary(categories):
    print("\n" + "=" * 60)
    print("🥩 תפריט מיטאון - פנחס הקצב")
    print("=" * 60)

    total = 0
    for cat in categories:
        print(f"\n📦 {cat['name']} ({len(cat['items'])} פריטים)")
        print("-" * 50)
        for item in cat['items']:
            price_str = f"₪{item['price']}"
            print(f"  • {item['name'][:40]:40} {price_str:>10}")
        total += len(cat['items'])

    print(f"\n{'='*60}")
    print(f"סה״כ: {total} פריטים ב-{len(categories)} קטגוריות")

def main():
    print("🥩 Scraping Meatown Menu")
    print("=" * 50)

    print("Fetching HTML...")
    html = fetch_html()
    print(f"Got {len(html)} bytes")

    print("Extracting products...")
    products = extract_products(html)
    print(f"Found {len(products)} products")

    if not products:
        print("❌ No products found!")
        return

    categories = organize_by_category(products)
    save_results(categories)
    print_summary(categories)

if __name__ == "__main__":
    main()
