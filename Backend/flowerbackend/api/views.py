import requests
import uuid
from decimal import Decimal
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Category, Product, CartItem, WishlistItem, Order, OrderItem, Coupon, Address, Contact
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartItemSerializer,
    WishlistItemSerializer,
    OrderSerializer,
    UserSerializer,
    UserProfileSerializer,
    CouponSerializer,
    AddressSerializer,
    ContactSerializer,
)
from .permissions import IsAdminOrReadOnly
import logging
import requests
import string
import random
from django.conf import settings

# Optional imports for server-side Google verification
try:
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
except Exception:
    google_id_token = None
    google_requests = None

logger = logging.getLogger(__name__)

def generate_random_password(length=12):
    chars = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(chars) for _ in range(length))

class GoogleLoginView(APIView):
    permission_classes = []

    def post(self, request):
        token = request.data.get("id_token") or request.data.get("token")
        if not token:
            return Response({"error": "id_token is required"}, status=400)

        try:
            idinfo = None

            # Try server-side verification with google-auth if available
            try:
                if google_id_token and google_requests:
                    idinfo = google_id_token.verify_oauth2_token(
                        token,
                        google_requests.Request(),
                        settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
                    )
            except Exception as e:
                logger.warning("Server-side Google verification failed: %s", str(e))
                idinfo = None

            # Fallback: call Google's tokeninfo endpoint
            if idinfo is None:
                r = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}", timeout=5)
                if r.status_code != 200:
                    logger.warning("Google tokeninfo returned %s: %s", r.status_code, r.text)
                    return Response({"error": "Invalid Google token"}, status=400)
                idinfo = r.json()

                # Verify aud matches expected client ID
                aud = idinfo.get("aud")
                expected_aud = getattr(settings, "SOCIAL_AUTH_GOOGLE_OAUTH2_KEY", None)
                if expected_aud and aud and aud != expected_aud:
                    logger.warning("Token aud mismatch: got %s expected %s", aud, expected_aud)
                    return Response({"error": "Token client ID does not match"}, status=400)

            email = idinfo.get("email")
            if not email:
                return Response({"error": "Google token did not contain email"}, status=400)

            # Check if user already exists
            user = User.objects.filter(email=email).first()
            if not user:
                username_base = email.split("@")[0]
                username = username_base
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{username_base}{counter}"
                    counter += 1

                # Generate secure random password
                password = generate_random_password()
                user = User.objects.create_user(username=username, email=email, password=password)
                user.first_name = idinfo.get("given_name", "")[:150]
                user.last_name = idinfo.get("family_name", "")[:150]
                user.save()

            # Issue JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_admin": user.is_staff,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        except requests.RequestException:
            logger.exception("Network error when verifying Google token")
            return Response({"error": "Network error verifying token"}, status=503)
        except Exception as exc:
            logger.exception("Unexpected error in GoogleLoginView")
            return Response({"error": "Internal server error", "details": str(exc)}, status=500)



# ----------------------------------------------------------
# USER REGISTER
# ----------------------------------------------------------
class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username already exists"}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_staff,
            }
        })


# ----------------------------------------------------------
# USER LOGIN
# ----------------------------------------------------------
class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid username or password"}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_staff,
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


# ----------------------------------------------------------
# CATEGORY CRUD
# ----------------------------------------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.annotate(product_count=Count("products")).order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]


# ----------------------------------------------------------
# PRODUCT CRUD
# ----------------------------------------------------------
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "short_description", "description", "category__name"]
    ordering_fields = ["name", "price", "created_at"]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Product.objects.all()
        return Product.objects.filter(is_active=True)


# ----------------------------------------------------------
# CART
# ----------------------------------------------------------
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related("product").order_by("-created_at")

    def perform_create(self, serializer):
        product = serializer.validated_data["product"]
        quantity = serializer.validated_data.get("quantity", 1)

        cart_item, created = CartItem.objects.get_or_create(
            user=self.request.user,
            product=product,
            defaults={"quantity": quantity},
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save(update_fields=["quantity", "updated_at"])

        return cart_item

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = self.perform_create(serializer)
        return Response(self.get_serializer(item).data, status=201)

    @action(detail=False, methods=["post"])
    def clear(self, request):
        self.get_queryset().delete()
        return Response({"detail": "Cart cleared"})

    @action(detail=False, methods=["get"])
    def summary(self, request):
        items = list(self.get_queryset())
        total_items = sum(i.quantity for i in items)
        total_amount = sum((i.subtotal for i in items), Decimal("0.00"))
        return Response({
            "items": CartItemSerializer(items, many=True).data,
            "total_items": total_items,
            "total_amount": total_amount
        })


# ----------------------------------------------------------
# WISHLIST
# ----------------------------------------------------------
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related("product").order_by("-created_at")

    def perform_create(self, serializer):
        product = serializer.validated_data["product"]
        wishlist_item, created = WishlistItem.objects.get_or_create(
            user=self.request.user,
            product=product
        )
        return wishlist_item

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = self.perform_create(serializer)
        output = self.get_serializer(item)
        return Response(output.data, status=status.HTTP_201_CREATED)


# ----------------------------------------------------------
# COUPONS
# ----------------------------------------------------------
class CouponViewSet(viewsets.ModelViewSet):
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]
    queryset = Coupon.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save()


# ----------------------------------------------------------
# ADDRESS
# ----------------------------------------------------------
class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by("-is_default", "-updated_at")

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        return serializer.save(user=self.request.user)


# ----------------------------------------------------------
# ORDERS
# ----------------------------------------------------------
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Order.objects.select_related("user").prefetch_related("items__product").order_by("-created_at")
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)

    # Custom endpoint: fetch order by tracking_id
    @action(detail=False, url_path='tracking/(?P<tracking_id>[^/.]+)')
    def by_tracking(self, request, tracking_id=None):
        order = get_object_or_404(Order, tracking_id=tracking_id)
        serializer = self.get_serializer(order)
        return Response(serializer.data)


# ----------------------------------------------------------
# CHECKOUT
# ----------------------------------------------------------
class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(user=request.user).select_related("product")
        if not cart_items.exists():
            return Response({"detail": "Cart empty"}, status=400)

        payment_method = request.data.get("payment_method")
        total_amount = sum(item.subtotal for item in cart_items)

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            payment_method=payment_method,
            payment_reference=str(uuid.uuid4())
        )

        OrderItem.objects.bulk_create([
            OrderItem(order=order, product=i.product, quantity=i.quantity, price=i.product.price)
            for i in cart_items
        ])

        cart_items.delete()
        return Response(OrderSerializer(order).data, status=201)


# ----------------------------------------------------------
# DASHBOARDS
# ----------------------------------------------------------
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "orders": Order.objects.count(),
            "products": Product.objects.count(),
            "users": User.objects.count(),
            "earnings": Order.objects.aggregate(total=Sum("total_amount"))["total"] or 0
        })


class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "orders": Order.objects.filter(user=request.user).count(),
            "wishlist": WishlistItem.objects.filter(user=request.user).count(),
            "cart_items": CartItem.objects.filter(user=request.user).count(),
        })


# ----------------------------------------------------------
# PROFILE UPDATE
# ----------------------------------------------------------
class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ----------------------------------------------------------
# HOME CONTENT
# ----------------------------------------------------------
class HomeContentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        featured_products = Product.objects.filter(is_featured=True, is_active=True)[:8]
        categories = Category.objects.annotate(product_count=Count("products")).order_by("name")[:5]

        return Response({
            "headline": "Fresh flowers delivered with love",
            "subtitle": "Hand-picked bouquets for every occasion.",
            "featuredProducts": ProductSerializer(featured_products, many=True, context={"request": request}).data,
            "topCategories": CategorySerializer(categories, many=True).data,
        })


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_staff,
            "date_joined": user.date_joined,
        })

class SearchProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = request.GET.get('q', '')
        products = Product.objects.filter(name__icontains=q)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
class LiveSearchAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        query = request.GET.get('q', '')
        if query:
            products = Product.objects.filter(name__icontains=query)[:10]  # limit results
        else:
            products = Product.objects.none()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    

class ContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Your message has been sent successfully!"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AdminContactMessagesView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get all contact messages"""
        contacts = Contact.objects.all().order_by('-created_at')
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
    
    def patch(self, request):
        """Mark contact message as read"""
        contact_id = request.data.get('id')
        try:
            contact = Contact.objects.get(id=contact_id)
            contact.is_read = True
            contact.save()
            return Response({"detail": "Message marked as read"})
        except Contact.DoesNotExist:
            return Response({"detail": "Message not found"}, status=404)
    
    def delete(self, request):
        """Delete a contact message"""
        contact_id = request.data.get('id')
        try:
            contact = Contact.objects.get(id=contact_id)
            contact.delete()
            return Response({"detail": "Message deleted"})
        except Contact.DoesNotExist:
            return Response({"detail": "Message not found"}, status=404)
        

class ValidateCouponView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get("code", "").strip().upper()
        subtotal = request.data.get("subtotal", 0)

        if not code:
            return Response(
                {"error": "Coupon code is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            coupon = Coupon.objects.get(code=code)
            
            # Check if coupon is valid
            if not coupon.is_valid_now():
                return Response(
                    {"error": "This coupon has expired or is inactive"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check minimum order value
            if subtotal < coupon.min_order_value:
                return Response(
                    {"error": f"Minimum order value should be ₹{coupon.min_order_value}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate discount
            if coupon.discount_type == "percent":
                discount = (subtotal * coupon.discount_value) / 100
                if coupon.max_discount_value:
                    discount = min(discount, coupon.max_discount_value)
            else:  # flat amount
                discount = coupon.discount_value
            
            return Response({
                "success": True,
                "code": coupon.code,
                "description": coupon.description,
                "discount_type": coupon.discount_type,
                "discount_value": float(coupon.discount_value),
                "discount_amount": float(discount),
                "message": f"Coupon applied! You saved ₹{discount:.2f}"
            }, status=200)
        
        except Coupon.DoesNotExist:
            return Response(
                {"error": "Invalid coupon code"},
                status=status.HTTP_404_NOT_FOUND
            )
        

class VerifyRazorpayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        import hmac
        import hashlib
        
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")
        order_id = request.data.get("order_id")

        # Verify signature
        key_secret = "your_razorpay_key_secret"  # Add to settings.py
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        
        generated_signature = hmac.new(
            key_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()

        if generated_signature == razorpay_signature:
            # Update order status to paid
            try:
                order = Order.objects.get(id=order_id, user=request.user)
                order.payment_reference = razorpay_payment_id
                order.save()
                return Response({"success": True, "message": "Payment verified"}, status=200)
            except Order.DoesNotExist:
                return Response({"error": "Order not found"}, status=404)
        else:
            return Response({"error": "Invalid signature"}, status=400)
        

class FacebookLoginView(APIView):
    permission_classes = []

    def post(self, request):
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"error": "access_token is required"}, status=400)

        try:
            # Verify token with Facebook
            graph_url = f"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={access_token}"
            r = requests.get(graph_url, timeout=5)
            
            if r.status_code != 200:
                logger.warning("Facebook graph returned %s: %s", r.status_code, r.text)
                return Response({"error": "Invalid Facebook token"}, status=400)
            
            fbinfo = r.json()
            email = fbinfo.get("email")
            name = fbinfo.get("name", "")
            
            if not email:
                return Response({"error": "Facebook did not return email. Enable email permission."}, status=400)

            # Get or create user
            user = User.objects.filter(email=email).first()
            if not user:
                username_base = email.split("@")[0]
                username = username_base
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{username_base}{counter}"
                    counter += 1

                password = User.objects.make_random_password()
                user = User.objects.create_user(username=username, email=email, password=password)
                
                # Parse name into first/last
                name_parts = name.split(" ", 1)
                user.first_name = name_parts[0][:150]
                user.last_name = name_parts[1][:150] if len(name_parts) > 1 else ""
                user.save()

            # Issue JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_admin": user.is_staff,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        except requests.RequestException as re:
            logger.exception("Network error when verifying Facebook token")
            return Response({"error": "Network error verifying token"}, status=503)
        except Exception as exc:
            logger.exception("Unexpected error in FacebookLoginView")
            return Response({"error": "Internal server error", "details": str(exc)}, status=500)
        


