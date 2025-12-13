from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    CategoryViewSet,
    ProductViewSet,
    CartViewSet,
    WishlistViewSet,
    OrderViewSet,
    CheckoutView,
    HomeContentView,
    UserProfileView,
    UserViewSet,
    CouponViewSet,
    AddressViewSet,
    AdminDashboardView,
    UserDashboardView,
    ProfileUpdateView,
    SearchProductsView,
    LiveSearchAPIView,
    ContactView,
    AdminContactMessagesView,
    ValidateCouponView,
    VerifyRazorpayView,
    GoogleLoginView,
    FacebookLoginView,
    
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("products", ProductViewSet, basename="product")
router.register("cart", CartViewSet, basename="cart")
router.register("wishlist", WishlistViewSet, basename="wishlist")
router.register("orders", OrderViewSet, basename="order")
router.register("users", UserViewSet, basename="user")
router.register("coupons", CouponViewSet, basename="coupon")
router.register("addresses", AddressViewSet, basename="address")

urlpatterns = [
     path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("google-login/", GoogleLoginView.as_view(), name="google-login"),
    path("facebook-login/", FacebookLoginView.as_view(), name="facebook-login"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("home/", HomeContentView.as_view(), name="home-content"),
    path("user/profile/", UserProfileView.as_view()),
    path("user/profile/update/", ProfileUpdateView.as_view()),
    path("dashboard/admin/", AdminDashboardView.as_view()),
    path("dashboard/user/", UserDashboardView.as_view()),
    path("search/products/", SearchProductsView.as_view(), name="search-products"),
    path("live-search/", LiveSearchAPIView.as_view(), name="live-search"),
    path("contact/submit/", ContactView.as_view(), name="contact-submit"),
    path("admin/contacts/", AdminContactMessagesView.as_view(), name="admin-contacts"),
    path("validate-coupon/", ValidateCouponView.as_view(), name="validate-coupon"),
    path("verify-razorpay/", VerifyRazorpayView.as_view(), name="verify-razorpay"),
    
]
