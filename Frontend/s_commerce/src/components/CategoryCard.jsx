import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category, subcategories }) => {
  const categorySubcategories = subcategories.filter(
    sub => sub.category === category.id
  );

  // Debug: Log the category data
  console.log('Category:', category.name, 'Image:', category.image);

  // Create background style
  let backgroundStyle = {};
  
  if (category.image) {
    // Use full URL if image already includes http, otherwise construct it
    const imageUrl = category.image.startsWith('http') 
      ? category.image 
      : `http://localhost:8000${category.image}`;
    console.log('Final image URL:', imageUrl);
    backgroundStyle = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${imageUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  } else {
    // Gradient fallback if no image
    console.log('No image, using gradient fallback');
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    ];
    const gradientIndex = category.id % gradients.length;
    backgroundStyle = {
      background: gradients[gradientIndex]
    };
  }

  return (
    <Link 
      to={`/category/${category.slug}`} 
      className="category-card"
      style={backgroundStyle}
    >
      <div className="category-content">
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
      </div>
    </Link>
  );
};

export default CategoryCard;
