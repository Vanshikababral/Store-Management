from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Product, Category

# Unregister the default User admin
admin.site.unregister(User)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active')
    actions = ['approve_users']

    def approve_users(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f"{count} users have been successfully approved and activated.")
    approve_users.short_description = "Approve and Activate selected users"

admin.site.register(Product)
admin.site.register(Category)