import React, { useEffect, useState } from 'react';
import type { Business, Product, Category } from '../types';
import { getBusinesses, saveDataLocally } from '../services/dataService';
import BusinessCard from '../components/BusinessCard';
import ProductCard from '../components/ProductCard';

const generateId = () => Math.random().toString(36).substr(2, 9);

const TestPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const b = await getBusinesses();
    setBusinesses(b);
    
    const c = (await import('../data/categories.json?raw')).default;
    setAllCategories(JSON.parse(c));
    
    const p = (await import('../data/products.json?raw')).default;
    setAllProducts(JSON.parse(p));
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
      setSaveMessage('✅ İşletme bilgisi kaydedildi!');
      setBusinesses(updatedBusinesses);
      setTimeout(() => setEditingBusiness(null), 1500);
    } else {
      setSaveMessage('❌ Kaydedilirken hata oluştu.');
    }
    setIsSaving(false);
  };

  const handleCategoryChange = (field: keyof Category, value: any) => {
    if (!editingCategory) return;
    setEditingCategory({ ...editingCategory, [field]: value });
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    setIsSaving(true);
    setSaveMessage('');
    
    let updatedCategories;
    if (allCategories.find(c => c.id === editingCategory.id)) {
      updatedCategories = allCategories.map(c => c.id === editingCategory.id ? editingCategory : c);
    } else {
      updatedCategories = [...allCategories, editingCategory];
    }

    const success = await saveDataLocally('categories', updatedCategories);
    if (success) {
      setSaveMessage('✅ Kategori kaydedildi!');
      setAllCategories(updatedCategories);
      setTimeout(() => setEditingCategory(null), 1500);
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
    
    let updatedAllProducts;
    if (allProducts.find(p => p.id === editingProduct.id)) {
      updatedAllProducts = allProducts.map(p => p.id === editingProduct.id ? editingProduct : p);
    } else {
      updatedAllProducts = [...allProducts, editingProduct];
    }

    const success = await saveDataLocally('products', updatedAllProducts);
    if (success) {
      setSaveMessage('✅ Ürün bilgisi kaydedildi!');
      setAllProducts(updatedAllProducts);
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
    
    const updatedAllProducts = allProducts.map(p => {
      if (p.name.trim().toLowerCase() === editingProduct.name.trim().toLowerCase()) {
        return { ...p, price: editingProduct.price, imageUrl: editingProduct.imageUrl, shortDescription: editingProduct.shortDescription };
      }
      return p;
    });

    const success = await saveDataLocally('products', updatedAllProducts);
    if (success) {
      setSaveMessage('✅ Tüm işletmelerde güncellendi!');
      setAllProducts(updatedAllProducts);
      setTimeout(() => setEditingProduct(null), 1500);
    } else {
      setSaveMessage('❌ Kaydedilirken hata oluştu.');
    }
    setIsSaving(false);
  };

  const addNewCategory = () => {
    if (!selectedBusinessId) return;
    setEditingCategory({
      id: `cat_${generateId()}`,
      businessId: selectedBusinessId,
      name: 'Yeni Kategori',
      order: 99
    });
  };

  const addNewProduct = (categoryId: string) => {
    setEditingProduct({
      id: `prod_${generateId()}`,
      businessId: selectedBusinessId || '',
      categoryId,
      name: 'Yeni Ürün',
      price: 0,
      imageUrl: '/assets/placeholder.jpg',
      shortDescription: '',
      badges: { vegan: false, vegetarian: false, glutenFree: false }
    });
  };

  if (!selectedBusinessId) {
    return (
      <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
        <h1 style={{ padding: 'var(--space-md) 0' }}>Yönetim Paneli</h1>
        <p className="text-muted" style={{ marginBottom: 'var(--space-xl)' }}>
          İşletmenin menüsünü düzenlemek için işletme kartına tıklayın. Sadece işletme detaylarını düzenlemek için "DÜZENLEMEK İÇİN TIKLA" butonuna basın.
        </p>

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
                value={editingBusiness.description || ''} 
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
            <div key={b.id} style={{ position: 'relative', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setSelectedBusinessId(b.id)}>
              <div style={{ pointerEvents: 'none' }}>
                <BusinessCard business={b} onClick={() => {}} />
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setEditingBusiness(b); }}
                style={{ position: 'absolute', top: 10, right: 10, background: 'var(--color-primary)', color: '#fff', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '10px', cursor: 'pointer', zIndex: 10, pointerEvents: 'auto' }}>
                DÜZENLEMEK İÇİN TIKLA
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const business = businesses.find(b => b.id === selectedBusinessId);
  const businessCategories = allCategories.filter(c => c.businessId === selectedBusinessId).sort((a,b) => a.order - b.order);

  return (
    <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
      <button 
        className="btn" 
        onClick={() => setSelectedBusinessId(null)} 
        style={{ background: '#333', color: '#fff', marginBottom: 'var(--space-md)', padding: '6px 12px', fontSize: '0.9rem' }}
      >
        ← Geri Dön (İşletme Seçimi)
      </button>
      
      <h1 style={{ padding: '0 0 var(--space-md) 0' }}>{business?.name} - Menü Yönetimi</h1>

      <button className="btn btn-primary" onClick={addNewCategory} style={{ marginBottom: 'var(--space-xl)' }}>
        + Yeni Kategori Ekle
      </button>

      {editingCategory && (
        <div className="glass" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)', border: '2px solid var(--color-primary)' }}>
          <h3>Kategori Düzenle: {editingCategory.name}</h3>
          
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Kategori Adı:</label>
            <input 
              type="text" 
              value={editingCategory.name} 
              onChange={e => handleCategoryChange('name', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Sıralama (Küçük sayı önce çıkar):</label>
            <input 
              type="number" 
              value={editingCategory.order} 
              onChange={e => handleCategoryChange('order', Number(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handleSaveCategory} disabled={isSaving}>
              {isSaving ? 'Kaydediliyor...' : '💾 Kategoriyi Kaydet'}
            </button>
            <button className="btn" onClick={() => setEditingCategory(null)} style={{ background: '#e0e0e0', color: '#333' }}>
              İptal
            </button>
            {saveMessage && <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>{saveMessage}</span>}
          </div>
        </div>
      )}

      {editingProduct && (
        <div id="product-editor" className="glass" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)', border: '2px solid var(--color-primary)' }}>
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
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Kısa Açıklama:</label>
            <textarea 
              value={editingProduct.shortDescription || ''} 
              onChange={e => handleProductChange('shortDescription', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Resim URL (Örn: /assets/cay.jpg):</label>
            <input 
              type="text" 
              value={editingProduct.imageUrl || ''} 
              onChange={e => handleProductChange('imageUrl', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {editingProduct.imageUrl && (
               <img src={editingProduct.imageUrl} alt="Önizleme" style={{ height: '60px', marginTop: '8px', borderRadius: '4px' }} />
            )}
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

      {businessCategories.map(c => {
        const catProducts = allProducts.filter(p => p.categoryId === c.id);
        
        return (
          <div key={c.id} style={{ marginBottom: 'var(--space-2xl)', padding: 'var(--space-md)', background: '#f9f9f9', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{c.name}</h2>
              <button className="btn" onClick={() => setEditingCategory(c)} style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'var(--color-primary)', color: '#fff' }}>
                Kategoriyi Düzenle
              </button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <button className="btn" onClick={() => { addNewProduct(c.id); setTimeout(() => document.getElementById('product-editor')?.scrollIntoView(), 100); }} style={{ padding: '6px 12px', fontSize: '0.85rem', background: '#333', color: '#fff' }}>
                + Bu Kategoriye Yeni Ürün Ekle
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {catProducts.map(p => (
                <div key={p.id} style={{ position: 'relative' }}>
                  <div style={{ pointerEvents: 'none' }}>
                     <ProductCard product={p} onClick={() => {}} />
                  </div>
                  <div 
                    onClick={() => { setEditingProduct(p); setTimeout(() => document.getElementById('product-editor')?.scrollIntoView(), 100); }}
                    style={{ position: 'absolute', top: 10, right: 10, background: 'var(--color-primary)', color: '#fff', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '10px', cursor: 'pointer', pointerEvents: 'auto' }}>
                    DÜZENLE
                  </div>
                </div>
              ))}
              {catProducts.length === 0 && <p style={{ fontSize: '0.9rem', color: '#888' }}>Bu kategoride henüz ürün yok.</p>}
            </div>
          </div>
        );
      })}
      {businessCategories.length === 0 && <p>Bu işletme için kategori bulunamadı.</p>}
    </div>
  );
};

export default TestPage;
