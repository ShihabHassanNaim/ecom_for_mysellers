import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        total_amount: getCartTotal(),
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Create order via backend API
      await createOrder(orderData);
      
      // Clear cart and go to success page
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="continue-shopping-btn">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => {
              const imageUrl = item.images && item.images.length > 0 
                ? `http://localhost:8000${item.images[0].image}`
                : 'https://via.placeholder.com/100x100?text=No+Image';

              return (
                <div key={item.id} className="cart-item">
                  <img src={imageUrl} alt={item.name} className="cart-item-image" />
                  
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">${parseFloat(item.price).toFixed(2)}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock || loading}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>

                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            {!user && (
              <p className="login-notice">Please login to complete your order</p>
            )}
            {error && (
              <div className="error-message">{error}</div>
            )}
            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
            <button className="clear-cart-btn" onClick={clearCart} disabled={loading}>
              Clear Cart
            </button>
            <Link to="/products" className="continue-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
