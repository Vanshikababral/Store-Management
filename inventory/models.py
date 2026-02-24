from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def __str__(self):
        return self.name

class Sale(models.Model):
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale: {self.product_name} x {self.quantity}"