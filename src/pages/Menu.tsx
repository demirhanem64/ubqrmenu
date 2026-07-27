import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Business, Category, Product } from '../types';
import { getBusinessBySlug, getCategoriesByBusiness, getProductsByCategory } from '../services/dataService';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import './Menu.css';

const Menu: React.FC = () => {
  const { businessId: slug } = useParams<{ businessId: string }>(); // slug from URL
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      const b = await getBusinessBySlug(slug);
      if (!b) {
        navigate('/'); // not found
        return;
      }
      setBusiness(b);
      
      // Update theme if defined
      if (b.theme) {
        document.documentElement.setAttribute('data-theme', b.theme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      const cats = await getCategoriesByBusiness(b.id);
      setCategories(cats);
      
      const savedCategory = sessionStorage.getItem(`activeCategory_${b.id}`);
      if (savedCategory && cats.some(c => c.id === savedCategory)) {
        setActiveCategoryId(savedCategory);
      } else {
        setActiveCategoryId('');
      }
    };
    loadData();
    
    // cleanup theme
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, [businessId, navigate]);

  useEffect(() => {
    if (!activeCategoryId) {
      setProducts([]);
      return;
    }
    const loadProducts = async () => {
      const prods = await getProductsByCategory(activeCategoryId);
      setProducts(prods);
    };
    loadProducts();
  }, [activeCategoryId]);

  if (!business) return null;

  return (
    <div>
      <Header title={business.name} showBack={true} />
      
      {categories.length > 0 && (
        <CategoryNav 
          categories={categories} 
          activeCategoryId={activeCategoryId} 
          onSelect={(id) => {
            setActiveCategoryId(id);
            if (business) {
              sessionStorage.setItem(`activeCategory_${business.id}`, id);
            }
          }} 
        />
      )}

      <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
        {!activeCategoryId ? (
          <div className="category-grid-main">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-grid-item"
                onClick={() => {
                  setActiveCategoryId(category.id);
                  if (business) {
                    sessionStorage.setItem(`activeCategory_${business.id}`, category.id);
                  }
                }}
              >
                <div className="category-grid-img-container">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} loading="lazy" />
                  ) : (
                    <span className="category-grid-placeholder">{category.name.charAt(0)}</span>
                  )}
                </div>
                <span className="category-grid-title">{category.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {products.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', marginTop: 'var(--space-xl)', gridColumn: '1 / -1' }}>Bu kategoride ürün bulunmamaktadır.</p>
            ) : (
              products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={(id) => navigate(`/${slug}/product/${id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
