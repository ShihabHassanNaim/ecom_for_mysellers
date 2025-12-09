import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category, subcategories }) => {
  const categorySubcategories = subcategories.filter(
    sub => sub.category === category.id
  );

  return (
    <Link to={`/category/${category.slug}`} className="category-card">
      <h3 className="category-name">{category.name}</h3>
      <div className="subcategories">
        {categorySubcategories.length > 0 ? (
          categorySubcategories.map(sub => (
            <span key={sub.id} className="subcategory-tag">
              {sub.name}
            </span>
          ))
        ) : (
          <p className="no-subcategories">No subcategories</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
