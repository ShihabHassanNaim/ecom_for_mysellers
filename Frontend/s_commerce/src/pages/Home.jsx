import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching products and categories...');
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        
        console.log('Products received:', productsData);
        console.log('Categories received:', categoriesData);
        
        setProducts(productsData.slice(0, 8));
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please make sure the backend is running.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ShopHub</h1>
          <p className="hero-subtitle">Discover amazing products at great prices</p>
        </div>
      </section>

      <div className="container">
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        <section className="section">
          <h2 className="section-title">Featured Products</h2>
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products available. Please add products through the Django admin panel.</p>
              <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '1rem' }}>
                Admin: <a href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer">http://localhost:8000/admin</a>
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
