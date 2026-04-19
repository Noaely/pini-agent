#!/usr/bin/env python3
"""
Extract discounts/sales data from Meatown HTML page
Each discount includes: title, description, and list of applicable products
Saves to data/meatown_discounts.json
"""

import json
import re
import html
import requests
from datetime import datetime

URL = "https://orders.meatown.co.il/front/catering/1/2026-04-19"


def fetch_html():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    response = requests.get(URL, headers=headers)
    response.encoding = 'utf-8'
    return response.text


def extract_products(html_content):
    """Extract all products with their IDs and names"""
    products = {}

    # Extract product data from embedded JSON
    product_pattern = r'\{"id":(\d+),[^}]*"name":"([^"]+)"[^}]*"price":([0-9.]+)[^}]*"category_id":(\d+)[^}]*\}'

    matches = re.findall(product_pattern, html_content)

    for match in matches:
        prod_id, name, price, cat_id = match

        # Decode unicode escapes
        try:
            name = name.encode().decode('unicode_escape')
        except:
            pass

        name = name.strip()
        products[int(prod_id)] = {
            "id": prod_id,
            "name": name,
            "price": float(price)
        }

    return products


def extract_discounts(html_content, products):
    """Extract discount data from data-discount attributes"""
    discounts = []

    # Find all data-discount attributes
    pattern = r'data-discount="(\{[^"]*\})"'
    matches = re.findall(pattern, html_content)

    seen_ids = set()

    for match in matches:
        # Unescape HTML entities
        json_str = html.unescape(match)

        try:
            data = json.loads(json_str)
        except json.JSONDecodeError:
            continue

        discount_id = data.get('id')
        if discount_id in seen_ids:
            continue
        seen_ids.add(discount_id)

        # Skip inactive discounts
        if not data.get('is_active'):
            continue

        title = data.get('title', '') or data.get('title_translated', '')
        description = data.get('description', '') or data.get('description_translated', '')

        # Get product IDs this discount applies to
        product_ids = data.get('cart_products_included_ids', [])

        # Map product IDs to product names
        applicable_products = []
        for pid in product_ids:
            if pid in products:
                applicable_products.append({
                    "id": str(pid),
                    "name": products[pid]["name"],
                    "price": products[pid]["price"]
                })
            else:
                applicable_products.append({
                    "id": str(pid),
                    "name": f"מוצר {pid}",
                    "price": 0
                })

        discounts.append({
            "id": discount_id,
            "title": title,
            "description": description,
            "amount": data.get('amount'),
            "min_products": data.get('cart_products'),
            "applicable_products": applicable_products
        })

    return discounts


def save_results(discounts):
    output = {
        "source": "meatown",
        "store_name": "פנחס הקצב",
        "category": "הנחות",
        "url": URL,
        "scraped_at": datetime.now().isoformat(),
        "discounts": discounts
    }

    with open("data/meatown_discounts.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("✓ Saved to data/meatown_discounts.json")


def print_summary(discounts):
    print("\n" + "=" * 60)
    print("🏷️  הנחות - פנחס הקצב")
    print("=" * 60)

    if not discounts:
        print("\nאין הנחות כרגע")
        return

    for discount in discounts:
        print(f"\n📌 {discount['title']}")
        if discount['description']:
            print(f"   תאור: {discount['description']}")
        print(f"   מחיר: ₪{discount['amount']}")
        if discount['min_products']:
            print(f"   מינימום: {discount['min_products']} פריטים")
        print("   פריטים משתתפים:")
        for product in discount['applicable_products']:
            print(f"      • {product['name']}")

    print(f"\n{'='*60}")
    print(f"סה״כ: {len(discounts)} הנחות פעילות")


def main():
    print("🏷️  Scraping Meatown Discounts")
    print("=" * 50)

    print("Fetching HTML...")
    html_content = fetch_html()
    print(f"Got {len(html_content)} bytes")

    print("Extracting products...")
    products = extract_products(html_content)
    print(f"Found {len(products)} products")

    print("Extracting discounts...")
    discounts = extract_discounts(html_content, products)
    print(f"Found {len(discounts)} discounts")

    save_results(discounts)
    print_summary(discounts)


if __name__ == "__main__":
    main()
