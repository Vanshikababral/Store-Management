from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, BasePermission
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

from .models import Product, Category, Sale 
from .serializers import (
    ProductSerializer, CategorySerializer, SaleSerializer, 
    UserSerializer, MyTokenObtainPairSerializer
)

# --- CUSTOM PERMISSIONS ---

class IsAdminOrReadOnly(BasePermission):
    """
    Allows safe methods (GET) for authenticated users, 
    but restricts POST/PUT/DELETE to staff/admins.
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user and request.user.is_authenticated
        return request.user and (request.user.is_staff or request.user.is_superuser)

# --- PRODUCT VIEWS ---

class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated] # Requires login to view/create

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

# --- CATEGORY VIEWS ---

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

# --- SALE VIEWS ---

class SaleList(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

# --- AUTH & USER VIEWS ---

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # New users start as inactive and non-staff
        serializer.save(is_active=False, is_staff=False)

class MeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id).order_by('-date_joined')

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserStatusView(generics.GenericAPIView):
    """
    The missing view that caused the ImportError.
    Checks if a username exists and if they are active.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return Response({
                'username': user.username,
                'is_active': user.is_active
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)