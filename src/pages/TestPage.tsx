import React, { useEffect, useState } from 'react';
import type { Business, Product } from '../types';
import { getBusinesses, getCategoriesByBusiness, getProductsByCategory, saveDataLocally } from '../services/dataService';
import BusinessCard from '../components/BusinessCard';
import ProductCard from '../components/ProductCard';

const TestPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const loadAll = async () => {
      const b = await getBusinesses();
      setBusinesses(b);
      
      if (b.length > 0) {
        const c = await getCategoriesByBusiness(b[0].id);
        if (c.length > 0) {
          const p = await getProductsByCategory(c[0].id);
          setProducts(p);
        }
      }
    };
    loadAll();
  }, []);

  const handleProductChange = (field: keyof Product, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    setSaveMessage('');
    
    // Fetch all products first to update the specific one
    const allProducts = (await import('../data/products.json')).default as Product[];
    
    const updatedAllProducts = allProducts.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );

    const success = await saveDataLocally('products', updatedAllProducts);
    if (success) {
      setSaveMessage('✅ Başarıyla kaydedildi! (Dosya güncellendi)');
      // Update local state
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setTimeout(() => setEditingProduct(null), 1500);
    } else {
      setSaveMessage('❌ Kaydedilirken hata oluştu.');
    }
    setIsSaving(false);
  };

  return (
    <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
      <h1 style={{ padding: 'var(--space-md) 0' }}>Test & Geliştirme Sayfası</h1>
      <p className="text-muted" style={{ marginBottom: 'var(--space-xl)' }}>
        Bu sayfada tasarımları test edebilir ve ürün verilerini (Fiyat vb.) değiştirip JSON dosyalarına doğrudan kaydedebilirsiniz. (Bu özellik sadece npm run dev modunda çalışır).
      </p>

      <h2>1. İşletme Kartları (Test)</h2>
      <div style={{ margin: 'var(--space-md) 0' }}>
        {businesses.map(b => (
          <BusinessCard key={b.id} business={b} onClick={() => {}} />
        ))}
      </div>

      <h2>2. Ürün Düzenleme (Canlı)</h2>
      <p className="text-muted" style={{ marginBottom: 'var(--space-sm)' }}>Aşağıdaki ürünlerden birine tıklayıp fiyat/isim değiştirin ve "Dosyaya Kaydet" deyin.</p>
      
      {editingProduct && (
        <div className="glass" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', border: '2px solid var(--color-primary)' }}>
          <h3>Ürün Düzenle: {editingProduct.name}</h3>
          
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Ürün Adı:</label>
            <input 
              type="text" 
              value={editingProduct.name} 
              onChange={e => handleProductChange('name', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Fiyat (₺):</label>
            <input 
              type="number" 
              value={editingProduct.price} 
              onChange={e => handleProductChange('price', Number(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handleSaveProduct} disabled={isSaving}>
              {isSaving ? 'Kaydediliyor...' : '💾 Dosyaya Kaydet'}
            </button>
            <button className="btn" onClick={() => setEditingProduct(null)} style={{ background: '#e0e0e0', color: '#333' }}>
              İptal
            </button>
            {saveMessage && <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>{saveMessage}</span>}
          </div>
        </div>
      )}

      <div style={{ margin: 'var(--space-md) 0' }}>
        {products.map(p => (
          <div key={p.id} style={{ position: 'relative' }}>
            <ProductCard product={p} onClick={() => setEditingProduct(p)} />
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--color-primary)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', pointerEvents: 'none' }}>
              DÜZENLEMEK İÇİN TIKLA
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
