import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1>Congratulations, {user.first_name || user.username}! 🎉</h1>
        <p className="success-message">
          Your order has been successfully placed!
        </p>
        
        <div className="order-details">
          <p>Order confirmation has been sent to <strong>{user.email}</strong></p>
          <p>You will receive your items soon.</p>
          <p className="thank-you">Thank you for shopping with us!</p>
        </div>

        <div className="success-actions">
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/" className="home-btn">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
