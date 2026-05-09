from rest_framework import serializers 
from django.contrib.auth.models import User
from .models import Product, Category, Sale
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# NEW: User Registration Serializer 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_active', 'is_staff', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True}
        }

    def create(self, validated_data):
        # This hashes the password properly in the database
        user = User.objects.create_user(**validated_data)
        return user

#Existing Serializers 
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'price', 'stock', 'description', 'category', 'category_name', 'image']

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

    def validate(self, data):
        """
        Check that the product exists and there's enough stock.
        """
        product_name = data.get('product_name')
        quantity = data.get('quantity')

        try:
            product = Product.objects.get(name=product_name)
        except Product.DoesNotExist:
            raise serializers.ValidationError(f"Product '{product_name}' does not exist.")

        if product.stock < quantity:
            raise serializers.ValidationError(f"Insufficient stock for '{product_name}'. Available: {product.stock}")

        # Attach the product object to the data so we can use it in create()
        data['product_obj'] = product
        return data

    def create(self, validated_data):
        """
        Reduce stock atomically and create the sale record.
        """
        from django.db import transaction
        
        product = validated_data.pop('product_obj')
        quantity = validated_data.get('quantity')

        with transaction.atomic():
            # Refresh from DB and lock the row for update to prevent race conditions
            product = Product.objects.select_for_update().get(pk=product.pk)
            product.stock -= quantity
            product.save()
            
            return super().create(validated_data)

#The "Staff Fix" Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the token payload
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_staff'] = self.user.is_staff
        data['is_superuser'] = self.user.is_superuser
        data['username'] = self.user.username
        return data