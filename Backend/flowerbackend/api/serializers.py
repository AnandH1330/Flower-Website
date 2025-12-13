from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db.models import Avg, Count
from .models import (
    Category,
    Product,
    CartItem,
    WishlistItem,
    Order,
    OrderItem,
    Coupon,
    Address,
    Contact,
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "is_staff",
            "is_active",
            "date_joined",
            "password",
        ]
        read_only_fields = ["id", "date_joined"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "date_joined", "password"]
        read_only_fields = ["id", "date_joined"]

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "product_count"]


# class ProductSerializer(serializers.ModelSerializer):
#     category = CategorySerializer(read_only=True)
#     category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source="category", write_only=True, required=False, allow_null=True)
#     image_url = serializers.SerializerMethodField()

#     class Meta:
#         model = Product
#         fields = "__all__"
#         read_only_fields = ["slug", "created_at", "updated_at"]

#     def get_image_url(self, obj):
#         request = self.context.get("request")
#         if obj.image and request:
#             return request.build_absolute_uri(obj.image.url)
#         return None

class ProductSerializer(serializers.ModelSerializer):
    # Extra computed fields
    discounted_price = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    # Category handling
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "category_id",
            "name",
            "slug",
            "short_description",
            "description",
            "price",
            "discount_percent",
            "discounted_price",
            "rating",
            "is_active",
            "is_featured",
            "image",
            "image_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "created_at",
            "updated_at",
            "discounted_price",
        ]

    # ---- Computed Methods ----
    def get_discounted_price(self, obj):
        return obj.discounted_price   # comes from model property

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source="product", write_only=True)

    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_id", "quantity", "subtotal", "created_at"]


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source="product", write_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "product", "product_id", "created_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(source="total_amount", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["status", "total_amount", "payment_reference", "created_at"]

    def get_user(self, obj):
        return {"id": obj.user.id, "username": obj.user.username}


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"
        read_only_fields = ["used_count", "created_at", "updated_at"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at", "updated_at"]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'is_read', 'created_at']