import { useState, useEffect } from 'react';
import { getProducts, getSubCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [subcategoryProducts, setSubcategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching subcategories and products...');
        const subcategoriesData = await getSubCategories();
        console.log('Subcategories received:', subcategoriesData);
        
        // For each subcategory, fetch products and get the first one
        const productsPromises = subcategoriesData.map(async (subcategory) => {
          try {
            const productsData = await getProducts({ subcategory: subcategory.id });
            if (productsData && productsData.length > 0) {
              return {
                subcategory: subcategory,
                product: productsData[0]
              };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching products for subcategory ${subcategory.name}:`, err);
            return null;
          }
        });

        const results = await Promise.all(productsPromises);
        const validResults = results.filter(item => item !== null);
        
        console.log('Subcategory products:', validResults);
        setSubcategoryProducts(validResults);
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
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to Mohollar Dokan</h1>
            <p className="hero-subtitle">Discover amazing products at great prices</p>
          </div>
          <div className="hero-graphics">
            <div className="shopping-cart-graphic">🛒</div>
            <div className="coin-graphic coin-1">🪙</div>
            <div className="coin-graphic coin-2">🪙</div>
            <div className="gift-graphic">🎁</div>
            <div className="cube-graphic">📦</div>
            <div className="discount-badge">
              <span className="discount-text">50%</span>
              <span className="off-text">OFF</span>
            </div>
          </div>
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
          {subcategoryProducts.length > 0 ? (
            <div className="products-grid">
              {subcategoryProducts.map(({ subcategory, product }) => (
                <ProductCard key={subcategory.id} product={product} />
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
