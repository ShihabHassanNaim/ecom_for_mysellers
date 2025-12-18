from django.urls import path
from .views import (
    RegisterView, login_view, logout_view, user_profile,
    CreateOrderView, UserOrdersView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', user_profile, name='profile'),
    path('orders/create/', CreateOrderView.as_view(), name='create-order'),
    path('orders/', UserOrdersView.as_view(), name='user-orders'),
]
