import { useState, useEffect } from 'react';
import { getCategories, getSubCategories } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching categories...');
        const categoriesData = await getCategories();
        const subcategoriesData = await getSubCategories();
        console.log('Categories received:', categoriesData);
        console.log('Subcategories received:', subcategoriesData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please make sure the backend is running.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading categories...</p>
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
    <div className="categories-page">
      <div className="container">
        <h1 className="page-title">Browse Categories</h1>
        {categories.length > 0 ? (
          <div className="categories-grid">
            {categories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                subcategories={subcategories}
              />
            ))}
          </div>
        ) : (
          <div className="no-categories">
            <p>No categories available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
