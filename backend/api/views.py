import uuid
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Tool, Order, ContactMessage, PageView, Testimonial
from .serializers import (
    ToolSerializer,
    OrderSerializer,
    ContactMessageSerializer,
    PageViewSerializer,
    TestimonialSerializer,
)


class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    lookup_field = "slug"

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Tool.objects.all()
        return Tool.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def destroy(self, request, *args, **kwargs):
        # Allow deleting by UUID if the lookup field is slug but a UUID is passed
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs[lookup_url_kwarg]
        try:
            # Check if it's a UUID
            uuid.UUID(val)
            instance = Tool.objects.get(id=val)
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValueError:
            return super().destroy(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        # Allow updating by UUID
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs[lookup_url_kwarg]
        try:
            uuid.UUID(val)
            instance = Tool.objects.get(id=val)
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except ValueError:
            return super().partial_update(request, *args, **kwargs)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]


class PageViewViewSet(viewsets.ModelViewSet):
    queryset = PageView.objects.all()
    serializer_class = PageViewSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]


class StatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tools_count = Tool.objects.filter(is_active=True).count()
        views_count = PageView.objects.count()
        return Response({
            "tools": tools_count,
            "customers": views_count,
        })


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id if hasattr(user, "id") else user.pk,
            "email": user.email,
            "username": user.username,
            "is_admin": user.is_staff,
        })


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Block signup if an admin user already exists
        if User.objects.exists():
            return Response(
                {"error": "Signup is disabled. An admin user has already been registered."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if user already exists
        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            return Response(
                {"error": "User with this email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            is_staff=True,       # Make admin
            is_superuser=True,   # Make superuser
        )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "message": "User created successfully",
            },
            status=status.HTTP_201_CREATED,
        )


class AssetUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get("file")
        folder = request.data.get("folder", "uploads")
        if not file_obj:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate folder name to prevent path traversal
        clean_folder = "".join(c for c in folder if c.isalnum() or c in ("-", "_"))
        ext = file_obj.name.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png", "webp", "svg", "gif"]:
            ext = "png"  # Default fallback

        # Save with UUID filename
        filename = f"{clean_folder}/{uuid.uuid4()}.{ext}"
        saved_path = default_storage.save(filename, file_obj)
        file_url = request.build_absolute_uri(settings.MEDIA_URL + saved_path)

        return Response(
            {
                "url": file_url,
                "path": saved_path,
            },
            status=status.HTTP_201_CREATED,
        )
