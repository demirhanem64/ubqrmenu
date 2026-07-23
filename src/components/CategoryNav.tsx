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
          <button
            key={category.id}
            className={`category-item ${activeCategoryId === category.id ? 'active' : ''}`}
            onClick={() => onSelect(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
