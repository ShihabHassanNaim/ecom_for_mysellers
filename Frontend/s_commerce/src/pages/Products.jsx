import { useState, useEffect, useMemo } from 'react';
import { getProducts, getCategories, getSubCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSub, setSelectedSub] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [cats, subs] = await Promise.all([getCategories(), getSubCategories()]);
        setCategories(cats);
        setSubcategories(subs);
      } catch (err) {
        console.error('Error fetching categories/subcategories', err);
        setError('Failed to load lookups. Please make sure the backend is running.');
      }
    };
    fetchLookups();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filters = {};
        if (selectedCategory !== 'all') {
          filters.category = selectedCategory;
        }
        if (selectedSub !== 'all') {
          filters.subcategory = selectedSub;
        }
        const data = await getProducts(filters);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please make sure the backend is running.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSub]);

  useEffect(() => {
    // Reset subcategory when category changes
    setSelectedSub('all');
  }, [selectedCategory]);

  const categorySubs = useMemo(() => {
    if (selectedCategory === 'all') return subcategories;
    const categoryObj = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
    return subcategories.filter((s) => s.category === categoryObj?.id);
  }, [categories, selectedCategory, subcategories]);

  const filteredProducts = products.filter(product => {
    if (statusFilter === 'active') return product.is_active;
    if (statusFilter === 'in-stock') return product.stock > 0;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">All Products</h1>
          <div className="filter-buttons">
            <select
              className="filter-btn"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <select
              className="filter-btn"
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              disabled={selectedCategory === 'all'}
            >
              <option value="all">All subcategories</option>
              {categorySubs.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({products.length})
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active ({products.filter(p => p.is_active).length})
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'in-stock' ? 'active' : ''}`}
              onClick={() => setStatusFilter('in-stock')}
            >
              In Stock ({products.filter(p => p.stock > 0).length})
            </button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
