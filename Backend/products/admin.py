from django.contrib import admin
from .models import Category, SubCategory, Product, ProductImage

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'image']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'slug']
    list_filter = ['category']
    prepopulated_fields = {'slug': ('name',)}

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'subcategory', 'price', 'stock', 'is_active']
    list_filter = ['subcategory', 'is_active']
    search_fields = ['name', 'description']
    inlines = [ProductImageInline]
