import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCategories,
  getSubCategories,
  getProducts,
} from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSub, setSelectedSub] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cats, subs] = await Promise.all([
          getCategories(),
          getSubCategories(),
        ]);
        const current = cats.find((c) => c.slug === slug);
        setCategory(current || null);
        setSubcategories(subs.filter((s) => s.category === current?.id));

        const productData = await getProducts({ category: slug });
        setProducts(productData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading category page', err);
        setError('Failed to load category.');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const filteredProducts = useMemo(() => {
    if (selectedSub === 'all') return products;
    return products.filter((p) => p.subcategory === selectedSub);
  }, [products, selectedSub]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading category...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Category not found.'}</p>
        <Link to="/categories" className="nav-link">Back to categories</Link>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">{category.name}</h1>
          <div className="filter-buttons" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              className={`filter-btn ${selectedSub === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedSub('all')}
            >
              All ({products.length})
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                className={`filter-btn ${selectedSub === sub.id ? 'active' : ''}`}
                onClick={() => setSelectedSub(sub.id)}
              >
                {sub.name} ({products.filter((p) => p.subcategory === sub.id).length})
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

