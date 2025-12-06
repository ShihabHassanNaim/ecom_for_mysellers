from django.urls import path
from .views import CategoryList, SubCategoryList, ProductList, ProductImageUpload

urlpatterns = [
    path('categories/', CategoryList.as_view()),
    path('subcategories/', SubCategoryList.as_view()),
    path('products/', ProductList.as_view()),
    path('products/upload-image/', ProductImageUpload.as_view()),
]
