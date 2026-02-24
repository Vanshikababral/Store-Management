from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ProductList, ProductDetail, CategoryList, CategoryDetail, SaleList, 
    MyTokenObtainPairView, RegisterView, UserListView, UserDetailView, UserStatusView, MeView
)

urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetail.as_view(), name='category-detail'),
    path('sales/', SaleList.as_view(), name='sale-list'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('user-status/<str:username>/', UserStatusView.as_view(), name='user-status'),
    path('me/', MeView.as_view(), name='user-me'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
# from django.urls import path
# from rest_framework_simplejwt.views import TokenRefreshView # Import this for token stability
# from .views import (
#     ProductList, ProductDetail, CategoryList, CategoryDetail, SaleList, 
#     MyTokenObtainPairView, RegisterView, UserListView, UserDetailView, UserStatusView, MeView
# )

# urlpatterns = [
#     # Changed 'token/' to 'login/' to match standard frontend expectations
#     path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
#     path('products/', ProductList.as_view(), name='product-list'),
#     path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
#     path('categories/', CategoryList.as_view(), name='category-list'),
#     path('categories/<int:pk>/', CategoryDetail.as_view(), name='category-detail'),
#     path('sales/', SaleList.as_view(), name='sale-list'),
#     path('register/', RegisterView.as_view(), name='auth_register'),
#     path('users/', UserListView.as_view(), name='user-list'),
#     path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
#     path('user-status/<str:username>/', UserStatusView.as_view(), name='user-status'),
#     path('me/', MeView.as_view(), name='user-me'),
# ]