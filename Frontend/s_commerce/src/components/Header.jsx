import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const cartCount = getCartCount();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isActive = (path) => pathname === path;

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      closeMenu();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="ShopHub Logo" className="logo-img" />
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </form>

        <button
          className={`menu-toggle ${open ? 'open' : ''}`}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? 'nav-open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Products
          </Link>
          <Link
            to="/categories"
            className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Categories
          </Link>
          <Link
            to="/cart"
            className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {user ? (
            <>
              <span className="nav-link user-name">👋 {user.first_name || user.username}</span>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
