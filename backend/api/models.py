import uuid
from django.db import models


class Tool(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=150, unique=True)
    name = models.CharField(max_length=200)
    mark = models.CharField(max_length=50, blank=True, default="")
    gradient = models.CharField(
        max_length=255, default="linear-gradient(135deg,#6d6eb0,#a5a6dc)"
    )
    category = models.CharField(max_length=100, blank=True, default="")
    tagline = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField(blank=True, default="")
    overview = models.TextField(blank=True, default="")
    what_it_does = models.TextField(blank=True, default="")
    who_for = models.TextField(blank=True, default="")
    original_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    our_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    duration = models.CharField(max_length=100, default="per month")
    benefits = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    advantages = models.JSONField(default=list, blank=True)
    use_cases = models.JSONField(default=list, blank=True)
    plans = models.JSONField(default=list, blank=True)
    faqs = models.JSONField(default=list, blank=True)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image_url = models.CharField(max_length=500, blank=True, default="")
    logo_url = models.CharField(max_length=500, blank=True, default="")
    logo = models.ImageField(upload_to="logos/", blank=True, null=True)
    image = models.ImageField(upload_to="images/", blank=True, null=True)
    categories = models.JSONField(default=list, blank=True)
    currency = models.CharField(max_length=10, default="USD")
    post_link = models.CharField(max_length=500, blank=True, default="")

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tool_slug = models.CharField(max_length=150, blank=True, default="")
    tool_name = models.CharField(max_length=200, blank=True, default="")
    plan_name = models.CharField(max_length=100, blank=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    whatsapp = models.CharField(max_length=50, blank=True, default="")
    note = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.id} - {self.customer_name} ({self.tool_name})"


class ContactMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Message from {self.name} - {self.email}"


class PageView(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    path = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"View of {self.path} at {self.created_at}"


class Testimonial(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200, blank=True, default="")
    quote = models.TextField()
    rating = models.IntegerField(default=5)
    avatar_url = models.CharField(max_length=500, blank=True, default="")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name
