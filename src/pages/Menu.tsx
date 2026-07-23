import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Business, Category, Product } from '../types';
import { getBusinessById, getCategoriesByBusiness, getProductsByCategory } from '../services/dataService';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';

const Menu: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!businessId) return;

    const loadData = async () => {
      const b = await getBusinessById(businessId);
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

      const cats = await getCategoriesByBusiness(businessId);
      setCategories(cats);
      if (cats.length > 0) {
        setActiveCategoryId(cats[0].id);
      }
    };
    loadData();
    
    // cleanup theme
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, [businessId, navigate]);

  useEffect(() => {
    if (!activeCategoryId) return;
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
          onSelect={setActiveCategoryId} 
        />
      )}

      <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
        {products.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>Bu kategoride ürün bulunmamaktadır.</p>
        ) : (
          products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={(id) => navigate(`/${businessId}/product/${id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;
