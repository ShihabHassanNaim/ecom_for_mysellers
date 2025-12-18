import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const firstImage = product.images && product.images.length > 0 ? product.images[0].image : null;
  const imageUrl = firstImage
    ? (firstImage.startsWith('http') ? firstImage : `http://localhost:8000${firstImage}`)
    : 'https://via.placeholder.com/300x300?text=No+Image';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={imageUrl} alt={product.name} />
          {!product.is_active && <div className="badge inactive">Inactive</div>}
          {product.stock === 0 && <div className="badge out-of-stock">Out of Stock</div>}
        </div>
      </Link>
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-link">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description.substring(0, 80)}...</p>
          <div className="product-footer">
            <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
            <span className="product-stock">Stock: {product.stock}</span>
          </div>
        </Link>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || !product.is_active}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
