import React from 'react';
import type { Category } from '../types';
import './CategoryNav.css';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelect: (id: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, activeCategoryId, onSelect }) => {
  return (
    <div className="category-nav-wrapper">
      <div className="category-nav">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${activeCategoryId === category.id ? 'active' : ''}`}
            onClick={() => onSelect(category.id)}
          >
            <div className="category-card-img-container">
              {category.imageUrl ? (
                <img src={category.imageUrl} alt={category.name} className="category-card-img" loading="lazy" />
              ) : (
                <span className="category-card-placeholder">{category.name.charAt(0)}</span>
              )}
            </div>
            <span className="category-card-title">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
