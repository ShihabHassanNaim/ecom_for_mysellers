from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import models

from .models import Category, SubCategory, Product, ProductImage
from .serializers import (
    CategorySerializer,
    SubCategorySerializer,
    ProductSerializer,
    ProductImageSerializer,
)


class CategoryList(generics.ListAPIView):
    """List all categories."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubCategoryList(generics.ListAPIView):
    """List all subcategories with their parent category."""

    queryset = SubCategory.objects.select_related("category").all()
    serializer_class = SubCategorySerializer


class ProductList(generics.ListAPIView):
    """
    List products with optional filtering.

    Query params:
    - category: category id or slug
    - subcategory: subcategory id or slug
    - search: search term for product name or description
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = (
            Product.objects.select_related("subcategory", "subcategory__category")
            .prefetch_related("images")
            .all()
        )

        category = self.request.query_params.get("category")
        subcategory = self.request.query_params.get("subcategory")
        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) | 
                models.Q(description__icontains=search)
            )

        if subcategory:
            if subcategory.isdigit():
                queryset = queryset.filter(subcategory_id=subcategory)
            else:
                queryset = queryset.filter(subcategory__slug=subcategory)

        if category:
            if category.isdigit():
                queryset = queryset.filter(subcategory__category_id=category)
            else:
                queryset = queryset.filter(subcategory__category__slug=category)

        return queryset
    
class ProductDetail(generics.RetrieveAPIView):
    """Retrieve a single product with images."""
    
    queryset = (
        Product.objects.select_related("subcategory", "subcategory__category")
        .prefetch_related("images")
        .all()
    )
    serializer_class = ProductSerializer


class ProductDetail(generics.RetrieveAPIView):
    """Retrieve a single product with images."""

    queryset = (
        Product.objects.select_related("subcategory", "subcategory__category")
        .prefetch_related("images")
        .all()
    )
    serializer_class = ProductSerializer


class ProductImageUpload(generics.CreateAPIView):
    """Upload a product image."""

    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    parser_classes = (MultiPartParser, FormParser)
