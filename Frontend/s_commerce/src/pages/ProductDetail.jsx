import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import './Products.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
        // pick first image as active if available
        if (data?.images?.length) {
          const first = data.images[0].image;
          setActiveImage(first);
        } else {
          setActiveImage(null);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading product', err);
        setError('Failed to load product.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Product not found.'}</p>
        <Link to="/products" className="nav-link">Back to products</Link>
      </div>
    );
  }

  const resolveUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://localhost:8000${path}`;
  };

  const mainImage = resolveUrl(activeImage) || 'https://via.placeholder.com/500x500?text=No+Image';

  return (
    <div className="products-page">
      <div className="container">
        <div className="product-detail">
          <div className="product-gallery">
            <img src={mainImage} alt={product.name} className="product-detail-main" />
            <div className="product-thumbs">
              {(product.images || []).map((img) => (
                <img
                  key={img.id}
                  src={resolveUrl(img.image)}
                  alt={product.name}
                  className="product-thumb"
                  onClick={() => setActiveImage(img.image)}
                />
              ))}
              {(!product.images || product.images.length === 0) && (
                <div className="product-thumb placeholder">No images</div>
              )}
            </div>
          </div>
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <p className="product-detail-price">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <p className="product-detail-desc">{product.description}</p>
            <p className="product-detail-meta">
              Status: {product.is_active ? 'Active' : 'Inactive'} | Stock: {product.stock}
            </p>
            <div className="product-detail-actions">
              <button
                className="primary-btn"
                onClick={() => addToCart(product)}
                disabled={!product.is_active || product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <Link to="/products" className="secondary-btn">
                Back to products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

