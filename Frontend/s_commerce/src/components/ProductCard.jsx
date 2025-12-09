import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0 
    ? `http://localhost:8000${product.images[0].image}`
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={product.name} />
        {!product.is_active && <div className="badge inactive">Inactive</div>}
        {product.stock === 0 && <div className="badge out-of-stock">Out of Stock</div>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description.substring(0, 80)}...</p>
        <div className="product-footer">
          <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
          <span className="product-stock">Stock: {product.stock}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
