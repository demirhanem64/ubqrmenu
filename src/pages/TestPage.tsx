import React, { useEffect, useState } from 'react';
import type { Business, Product } from '../types';
import { getBusinesses, getCategoriesByBusiness, getProductsByCategory, saveDataLocally } from '../services/dataService';
import BusinessCard from '../components/BusinessCard';
import ProductCard from '../components/ProductCard';

const TestPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

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

  const handleBusinessChange = (field: keyof Business, value: any) => {
    if (!editingBusiness) return;
    setEditingBusiness({ ...editingBusiness, [field]: value });
  };

  const handleSaveBusiness = async () => {
    if (!editingBusiness) return;
    setIsSaving(true);
    setSaveMessage('');
    
    const updatedBusinesses = businesses.map(b => 
      b.id === editingBusiness.id ? editingBusiness : b
    );

    const success = await saveDataLocally('businesses', updatedBusinesses);
    if (success) {
      setSaveMessage('✅ İşletme bilgisi kaydedildi! (Dosya güncellendi)');
      setBusinesses(updatedBusinesses);
      setTimeout(() => setEditingBusiness(null), 1500);
    } else {
      setSaveMessage('❌ Kaydedilirken hata oluştu.');
    }
    setIsSaving(false);
  };

  const handleProductChange = (field: keyof Product, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    setSaveMessage('');
    
    const allProducts = (await import('../data/products.json')).default as Product[];
    
    const updatedAllProducts = allProducts.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );

    const success = await saveDataLocally('products', updatedAllProducts);
    if (success) {
      setSaveMessage('✅ Ürün bilgisi kaydedildi! (Dosya güncellendi)');
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setTimeout(() => setEditingProduct(null), 1500);
    } else {
      setSaveMessage('❌ Kaydedilirken hata oluştu.');
    }
    setIsSaving(false);
  };

  const handleApplyToAll = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    setSaveMessage('');
    
    const allProducts = (await import('../data/products.json')).default as Product[];
    
    const updatedAllProducts = allProducts.map(p => {
      if (p.name.trim().toLowerCase() === editingProduct.name.trim().toLowerCase()) {
        return { ...p, price: editingProduct.price };
      }
      return p;
    });

    const success = await saveDataLocally('products', updatedAllProducts);
    if (success) {
      setSaveMessage('✅ Tüm işletmelerde güncellendi!');
      setProducts(products.map(p => 
        p.name.trim().toLowerCase() === editingProduct.name.trim().toLowerCase() 
          ? { ...p, price: editingProduct.price } 
          : p
      ));
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
        Bu sayfada tasarımları test edebilir, işletme bilgilerini (Açıklama/Duyuru, Adres) ve ürün verilerini (Fiyat vb.) değiştirip JSON dosyalarına doğrudan kaydedebilirsiniz. (Bu özellik sadece npm run dev modunda çalışır).
      </p>

      <h2>1. İşletme Bilgileri Düzenleme</h2>
      <p className="text-muted" style={{ marginBottom: 'var(--space-sm)' }}>İşletmenin duyurusunu (Açıklama) veya adresini değiştirmek için işletme kartına tıklayın.</p>
      
      {editingBusiness && (
        <div className="glass" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', border: '2px solid var(--color-primary)' }}>
          <h3>İşletme Düzenle: {editingBusiness.name}</h3>
          
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>İşletme Adı:</label>
            <input 
              type="text" 
              value={editingBusiness.name} 
              onChange={e => handleBusinessChange('name', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Duyuru / Açıklama (Örn: Kapalı Günler):</label>
            <textarea 
              value={editingBusiness.description} 
              onChange={e => handleBusinessChange('description', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Adres:</label>
            <input 
              type="text" 
              value={editingBusiness.address || ''} 
              onChange={e => handleBusinessChange('address', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleSaveBusiness} disabled={isSaving}>
              {isSaving ? 'Kaydediliyor...' : '💾 Bilgileri Kaydet'}
            </button>
            <button className="btn" onClick={() => setEditingBusiness(null)} style={{ background: '#e0e0e0', color: '#333' }}>
              İptal
            </button>
            {saveMessage && <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>{saveMessage}</span>}
          </div>
        </div>
      )}

      <div style={{ margin: 'var(--space-md) 0' }}>
        {businesses.map(b => (
          <div key={b.id} style={{ position: 'relative', cursor: 'pointer' }}>
            <BusinessCard business={b} onClick={() => setEditingBusiness(b)} />
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--color-primary)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', pointerEvents: 'none', zIndex: 10 }}>
              DÜZENLEMEK İÇİN TIKLA
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 'var(--space-2xl)' }}>2. Ürün Düzenleme (Canlı)</h2>
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

          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleSaveProduct} disabled={isSaving}>
              {isSaving ? 'Kaydediliyor...' : '💾 Sadece Bu Ürünü Kaydet'}
            </button>
            <button className="btn btn-primary" onClick={handleApplyToAll} disabled={isSaving} style={{ background: '#28a745' }}>
              🌍 Tüm İşletmelere Uygula (Aynı isimli ürünler)
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
