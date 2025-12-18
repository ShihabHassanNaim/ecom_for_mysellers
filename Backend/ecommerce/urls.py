from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),             # Admin route
    path('api/products/', include('products.urls')),      # Product API routes
    path('api/auth/', include('users.urls')),    # Authentication API routes
]

# Media files for product images
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
