import React, { useEffect, useState } from 'react';
import type { Business, Category, Product } from '../types';
import { getBusinesses, getCategoriesByBusiness, getProductsByCategory } from '../services/dataService';
import BusinessCard from '../components/BusinessCard';
import ProductCard from '../components/ProductCard';
import CategoryNav from '../components/CategoryNav';

const TestPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');

  useEffect(() => {
    const loadAll = async () => {
      const b = await getBusinesses();
      setBusinesses(b);
      
      if (b.length > 0) {
        const c = await getCategoriesByBusiness(b[0].id);
        setCategories(c);
        if (c.length > 0) {
          setActiveCategoryId(c[0].id);
          const p = await getProductsByCategory(c[0].id);
          setProducts(p);
        }
      }
    };
    loadAll();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
      <h1 style={{ padding: 'var(--space-md) 0' }}>Test & Geliştirme Sayfası</h1>
      <p className="text-muted" style={{ marginBottom: 'var(--space-xl)' }}>
        Bu sayfa sadece componentleri test etmek içindir. (Production build'e dahil edilmeyecek şekilde ayarlanabilir).
      </p>

      <h2>1. İşletme Kartları</h2>
      <div style={{ margin: 'var(--space-md) 0' }}>
        {businesses.map(b => (
          <BusinessCard key={b.id} business={b} onClick={() => {}} />
        ))}
      </div>

      <h2>2. Kategori Navigasyonu</h2>
      <div style={{ margin: 'var(--space-md) 0' }}>
        {categories.length > 0 && (
          <CategoryNav 
            categories={categories} 
            activeCategoryId={activeCategoryId} 
            onSelect={setActiveCategoryId} 
          />
        )}
      </div>

      <h2>3. Ürün Kartları</h2>
      <div style={{ margin: 'var(--space-md) 0' }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} onClick={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default TestPage;
