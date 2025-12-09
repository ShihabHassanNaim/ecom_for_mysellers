import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from products.models import Category, SubCategory, Product, ProductImage
from django.core.files.base import ContentFile
from io import BytesIO
from PIL import Image

# Clear existing data
Category.objects.all().delete()

# Create Categories
electronics = Category.objects.create(name="Electronics", slug="electronics")
clothing = Category.objects.create(name="Clothing", slug="clothing")
furniture = Category.objects.create(name="Furniture", slug="furniture")

# Create SubCategories
SubCategory.objects.create(category=electronics, name="Laptops", slug="laptops")
SubCategory.objects.create(category=electronics, name="Phones", slug="phones")
SubCategory.objects.create(category=electronics, name="Tablets", slug="tablets")

SubCategory.objects.create(category=clothing, name="Men", slug="men")
SubCategory.objects.create(category=clothing, name="Women", slug="women")

SubCategory.objects.create(category=furniture, name="Chairs", slug="chairs")
SubCategory.objects.create(category=furniture, name="Tables", slug="tables")

# Get subcategories for products
laptops = SubCategory.objects.get(slug="laptops")
phones = SubCategory.objects.get(slug="phones")
mens = SubCategory.objects.get(slug="men")
chairs = SubCategory.objects.get(slug="chairs")

# Create Products
products_data = [
    {
        "subcategory": laptops,
        "name": "MacBook Pro 14\"",
        "description": "Powerful laptop with M3 Pro chip, perfect for professionals and developers.",
        "price": 1999.99,
        "stock": 15,
        "is_active": True
    },
    {
        "subcategory": laptops,
        "name": "Dell XPS 15",
        "description": "Premium Windows laptop with stunning 4K display and powerful performance.",
        "price": 1799.99,
        "stock": 8,
        "is_active": True
    },
    {
        "subcategory": phones,
        "name": "iPhone 15 Pro",
        "description": "Latest iPhone with advanced camera system and A17 Pro chip.",
        "price": 999.99,
        "stock": 25,
        "is_active": True
    },
    {
        "subcategory": phones,
        "name": "Samsung Galaxy S24",
        "description": "Flagship Android phone with incredible display and AI features.",
        "price": 899.99,
        "stock": 20,
        "is_active": True
    },
    {
        "subcategory": mens,
        "name": "Premium Cotton T-Shirt",
        "description": "Comfortable 100% cotton t-shirt available in multiple colors.",
        "price": 29.99,
        "stock": 100,
        "is_active": True
    },
    {
        "subcategory": mens,
        "name": "Classic Denim Jeans",
        "description": "Timeless denim jeans with perfect fit and durability.",
        "price": 79.99,
        "stock": 50,
        "is_active": True
    },
    {
        "subcategory": chairs,
        "name": "Office Chair Pro",
        "description": "Ergonomic office chair with lumbar support and breathable mesh.",
        "price": 299.99,
        "stock": 12,
        "is_active": True
    },
    {
        "subcategory": chairs,
        "name": "Gaming Chair Elite",
        "description": "High-performance gaming chair with premium materials.",
        "price": 399.99,
        "stock": 8,
        "is_active": True
    }
]

# Create products
for prod_data in products_data:
    product = Product.objects.create(**prod_data)
    
    # Create a placeholder image for each product
    img = Image.new('RGB', (300, 300), color=(100, 150, 200))
    img_io = BytesIO()
    img.save(img_io, format='PNG')
    img_io.seek(0)
    
    ProductImage.objects.create(
        product=product,
        image=ContentFile(img_io.read(), name=f"{product.name}.png")
    )

print("✅ Sample data created successfully!")
print(f"📊 Categories: {Category.objects.count()}")
print(f"📑 SubCategories: {SubCategory.objects.count()}")
print(f"🛍️  Products: {Product.objects.count()}")
print(f"🖼️  Product Images: {ProductImage.objects.count()}")
