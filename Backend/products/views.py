from rest_framework import generics
from .models import Category, SubCategory, Product, ProductImage
from .serializers import CategorySerializer, SubCategorySerializer, ProductSerializer, ProductImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SubCategoryList(generics.ListAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductImageUpload(generics.CreateAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    parser_classes = (MultiPartParser, FormParser)
