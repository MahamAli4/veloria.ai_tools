from django.contrib import admin
from .models import Tool, Order, ContactMessage, PageView, Testimonial


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "category",
        "original_price",
        "our_price",
        "is_active",
        "sort_order",
    )
    list_filter = ("is_active", "category")
    search_fields = ("name", "slug", "tagline", "description")
    prepopulated_fields = {"slug": ("name",)}
    fieldsets = (
        (
            "Basic Info",
            {
                "fields": (
                    "name",
                    "slug",
                    "tagline",
                    "mark",
                    "gradient",
                    "category",
                    "categories",
                    "currency",
                )
            },
        ),
        (
            "Pricing & Active Status",
            {
                "fields": (
                    "original_price",
                    "our_price",
                    "duration",
                    "is_active",
                    "sort_order",
                )
            },
        ),
        (
            "Images & Links",
            {
                "fields": (
                    "logo",
                    "logo_url",
                    "image",
                    "image_url",
                    "post_link",
                )
            },
        ),
        (
            "Details & Copy",
            {
                "fields": (
                    "description",
                    "overview",
                    "what_it_does",
                    "who_for",
                )
            },
        ),
        (
            "Structured Lists (JSON)",
            {
                "fields": (
                    "benefits",
                    "features",
                    "advantages",
                    "use_cases",
                    "plans",
                    "faqs",
                ),
                "description": "Enter items as JSON lists or structures.",
            },
        ),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "customer_email",
        "tool_name",
        "plan_name",
        "price",
        "status",
        "created_at",
    )
    list_filter = ("status", "tool_name", "created_at")
    search_fields = ("customer_name", "customer_email", "whatsapp", "note")
    readonly_fields = ("created_at", "updated_at")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("created_at",)


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ("path", "created_at")
    list_filter = ("path", "created_at")
    readonly_fields = ("created_at",)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "rating", "is_active", "sort_order")
    list_filter = ("is_active", "rating")
    search_fields = ("name", "role", "quote")
