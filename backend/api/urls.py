from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    ToolViewSet,
    OrderViewSet,
    ContactMessageViewSet,
    PageViewViewSet,
    TestimonialViewSet,
    StatsView,
    MeView,
    SignupView,
    AssetUploadView,
)

router = DefaultRouter()
router.register("tools", ToolViewSet, basename="tool")
router.register("orders", OrderViewSet, basename="order")
router.register("contact", ContactMessageViewSet, basename="contact")
router.register("views", PageViewViewSet, basename="view")
router.register("testimonials", TestimonialViewSet, basename="testimonial")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/signup/", SignupView.as_view(), name="auth_signup"),
    path("auth/me/", MeView.as_view(), name="auth_me"),
    path("upload/", AssetUploadView.as_view(), name="asset_upload"),
    path("stats/", StatsView.as_view(), name="stats"),
]
