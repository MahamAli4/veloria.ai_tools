import os
import sys
import json
import urllib.request
from datetime import datetime

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "veloria_backend.settings")

import django
django.setup()

from api.models import Tool, Testimonial, Order, ContactMessage, PageView


# Supabase Connection Settings
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://mjjgxsdqsoywllpbaicl.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_rxC3lRXQiGSEPiDs37b17g_7-k4_f7A")


def fetch_supabase_data(table_name):
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?select=*"
    print(f"Fetching data from Supabase table: {table_name}...")
    req = urllib.request.Request(
        url,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print(f"Successfully fetched {len(data)} records from {table_name}.")
                return data
            else:
                print(f"Failed to fetch {table_name}: HTTP Status {response.status}")
                return []
    except Exception as e:
        print(f"Error fetching from {table_name}: {e}")
        return []


def migrate_tools():
    data = fetch_supabase_data("tools")
    count = 0
    for row in data:
        tool, created = Tool.objects.update_or_create(
            id=row["id"],
            defaults={
                "slug": row.get("slug"),
                "name": row.get("name"),
                "mark": row.get("mark", ""),
                "gradient": row.get("gradient", "linear-gradient(135deg,#6d6eb0,#a5a6dc)"),
                "category": row.get("category", ""),
                "tagline": row.get("tagline", ""),
                "description": row.get("description", ""),
                "overview": row.get("overview", ""),
                "what_it_does": row.get("what_it_does", ""),
                "who_for": row.get("who_for", ""),
                "original_price": row.get("original_price", 0.0),
                "our_price": row.get("our_price", 0.0),
                "duration": row.get("duration", "per month"),
                "benefits": row.get("benefits", []),
                "features": row.get("features", []),
                "advantages": row.get("advantages", []),
                "use_cases": row.get("use_cases", []),
                "plans": row.get("plans", []),
                "faqs": row.get("faqs", []),
                "sort_order": row.get("sort_order", 0),
                "is_active": row.get("is_active", True),
                "image_url": row.get("image_url", "") or "",
                "logo_url": row.get("logo_url", "") or "",
                "categories": row.get("categories", []),
                "currency": row.get("currency", "USD"),
                "post_link": row.get("post_link", "") or "",
            }
        )
        if created:
            count += 1
    print(f"Tools migration complete. Created {count} new records, updated {len(data) - count}.")


def migrate_testimonials():
    data = fetch_supabase_data("testimonials")
    count = 0
    for row in data:
        testimonial, created = Testimonial.objects.update_or_create(
            id=row["id"],
            defaults={
                "name": row.get("name"),
                "role": row.get("role", ""),
                "quote": row.get("quote", ""),
                "rating": row.get("rating", 5),
                "avatar_url": row.get("avatar_url", "") or "",
                "is_active": row.get("is_active", True),
                "sort_order": row.get("sort_order", 0),
            }
        )
        if created:
            count += 1
    print(f"Testimonials migration complete. Created {count} new records, updated {len(data) - count}.")


def migrate_orders():
    data = fetch_supabase_data("orders")
    count = 0
    for row in data:
        order, created = Order.objects.update_or_create(
            id=row["id"],
            defaults={
                "tool_slug": row.get("tool_slug", ""),
                "tool_name": row.get("tool_name", ""),
                "plan_name": row.get("plan_name", ""),
                "price": row.get("price", 0.0),
                "customer_name": row.get("customer_name"),
                "customer_email": row.get("customer_email"),
                "whatsapp": row.get("whatsapp", ""),
                "note": row.get("note", ""),
                "status": row.get("status", "pending"),
            }
        )
        # Preserve original creation date if possible
        if "created_at" in row:
            created_dt = datetime.fromisoformat(row["created_at"].replace("Z", "+00:00"))
            Order.objects.filter(id=row["id"]).update(created_at=created_dt)
        if created:
            count += 1
    print(f"Orders migration complete. Created {count} new records, updated {len(data) - count}.")


def migrate_contact_messages():
    data = fetch_supabase_data("contact_messages")
    count = 0
    for row in data:
        msg, created = ContactMessage.objects.update_or_create(
            id=row["id"],
            defaults={
                "name": row.get("name"),
                "email": row.get("email"),
                "message": row.get("message"),
                "is_read": row.get("is_read", False),
            }
        )
        if "created_at" in row:
            created_dt = datetime.fromisoformat(row["created_at"].replace("Z", "+00:00"))
            ContactMessage.objects.filter(id=row["id"]).update(created_at=created_dt)
        if created:
            count += 1
    print(f"Contact Messages migration complete. Created {count} new records, updated {len(data) - count}.")


def migrate_page_views():
    data = fetch_supabase_data("page_views")
    count = 0
    for row in data:
        view, created = PageView.objects.update_or_create(
            id=row["id"],
            defaults={
                "path": row.get("path"),
            }
        )
        if "created_at" in row:
            created_dt = datetime.fromisoformat(row["created_at"].replace("Z", "+00:00"))
            PageView.objects.filter(id=row["id"]).update(created_at=created_dt)
        if created:
            count += 1
    print(f"Page Views migration complete. Created {count} new records, updated {len(data) - count}.")


def main():
    print("--- Starting Supabase to Django Database Migration ---")
    migrate_tools()
    migrate_testimonials()
    migrate_orders()
    migrate_contact_messages()
    migrate_page_views()
    print("--- Database Migration Finished Successfully ---")


if __name__ == "__main__":
    main()
