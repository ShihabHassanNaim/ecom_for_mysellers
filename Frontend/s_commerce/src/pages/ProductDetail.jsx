import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';
import './Products.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
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

  const mainImage =
    product.images && product.images.length > 0
      ? `http://localhost:8000${product.images[0].image}`
      : 'https://via.placeholder.com/500x500?text=No+Image';

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
                  src={`http://localhost:8000${img.image}`}
                  alt={product.name}
                  className="product-thumb"
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
              <button className="primary-btn" disabled>
                Add to cart (coming soon)
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

