import React, { useEffect, useState } from 'react';
import type { Business, Product, Category, Settings } from '../types';
import { getBusinesses, saveDataLocally } from '../services/dataService';
import BusinessCard from '../components/BusinessCard';

const generateId = () => Math.random().toString(36).substr(2, 9);

const TestPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editingSettings, setEditingSettings] = useState<Settings | null>(null);
  
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [quickPrices, setQuickPrices] = useState<Record<string, string>>({});
  const [quickSaveStatus, setQuickSaveStatus] = useState<Record<string, string>>({});
  
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
    
    const s = (await import('../data/settings.json?raw')).default;
    setSettings(JSON.parse(s));
  };

  const handleBusinessChange = (field: keyof Business, value: any) => {
    if (!editingBusiness) return;
    setEditingBusiness({ ...editingBusiness, [field]: value });
  };

  const handleSaveBusiness = async () => {
    if (!editingBusiness) return;
    setIsSaving(true);
    setSaveMessage('');
    
    let updatedBusinesses;
    if (businesses.find(b => b.id === editingBusiness.id)) {
      updatedBusinesses = businesses.map(b => b.id === editingBusiness.id ? editingBusiness : b);
    } else {
      updatedBusinesses = [...businesses, editingBusiness];
    }

    const success = await saveDataLocally('businesses', updatedBusinesses);
    if (success) {
      setSaveMessage('✅ İşletme bilgisi kaydedildi!');
      setBusinesses(updatedBusinesses);
      setTimeout(() => { setEditingBusiness(null); setSaveMessage(''); }, 1500);
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
      setTimeout(() => { setEditingCategory(null); setSaveMessage(''); }, 1500);
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
      setQuickPrices(prev => { const c = { ...prev }; delete c[editingProduct.id]; return c; });
      setTimeout(() => { setEditingProduct(null); setSaveMessage(''); }, 1500);
    } else {
      setSaveMessage('❌ Kaydedilirken hata oluştu.');
    }
    setIsSaving(false);
  };

  
  const handleSaveSettings = async () => {
    if (!editingSettings) return;
    setIsSaving(true);
    setSaveMessage('');
    const success = await saveDataLocally('settings', editingSettings);
    if (success) {
      setSaveMessage('✅ Ayarlar kaydedildi!');
      setSettings(editingSettings);
      setTimeout(() => { setEditingSettings(null); setSaveMessage(''); }, 1500);
    } else {
      setSaveMessage('❌ Kaydedilirken hata oluştu.');
    }
    setIsSaving(false);
  };

  const handleDeleteBusiness = async () => {
    if (!editingBusiness) return;
    if (window.confirm("Bu işletmeyi silmek istediğinize emin misiniz?")) {
      const updated = businesses.filter(b => b.id !== editingBusiness.id);
      await saveDataLocally('businesses', updated);
      setBusinesses(updated);
      setEditingBusiness(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (!editingCategory) return;
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      const updated = allCategories.filter(c => c.id !== editingCategory.id);
      await saveDataLocally('categories', updated);
      setAllCategories(updated);
      setEditingCategory(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!editingProduct) return;
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      const updated = allProducts.filter(p => p.id !== editingProduct.id);
      await saveDataLocally('products', updated);
      setAllProducts(updated);
      setEditingProduct(null);
    }
  };

  const handleApplyToAll = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    setSaveMessage('');
    
    const originalProduct = allProducts.find(p => p.id === editingProduct.id);
    const searchName = originalProduct ? originalProduct.name.trim().toLocaleLowerCase('tr-TR') : editingProduct.name.trim().toLocaleLowerCase('tr-TR');
    
    let updatedAllProducts = allProducts.map(p => {
      if (p.id === editingProduct.id) {
        return editingProduct; // Orijinal ürünü her halükarda tam güncelleyelim
      }
      if (p.name.trim().toLocaleLowerCase('tr-TR') === searchName) {
        return { 
          ...p, 
          name: editingProduct.name,
          price: editingProduct.price, 
          imageUrl: editingProduct.imageUrl, 
          shortDescription: editingProduct.shortDescription,
          longDescription: editingProduct.longDescription,
          allergens: editingProduct.allergens,
          ingredients: editingProduct.ingredients,
          badges: editingProduct.badges
        };
      }
      return p;
    });

    if (!originalProduct && !allProducts.find(p => p.id === editingProduct.id)) {
      updatedAllProducts = [...updatedAllProducts, editingProduct];
    }

    const success = await saveDataLocally('products', updatedAllProducts);
    if (success) {
      setSaveMessage('✅ Tüm işletmelerde güncellendi!');
      setAllProducts(updatedAllProducts);
      setQuickPrices({});
      setTimeout(() => { setEditingProduct(null); setSaveMessage(''); }, 1500);
    } else {
      setSaveMessage('❌ Kaydedilirken hata oluştu.');
    }
    setIsSaving(false);
  };

  const handleQuickPriceSave = async (product: Product, applyToAllBusinesses: boolean = false) => {
    const rawVal = quickPrices[product.id];
    const newPrice = rawVal !== undefined ? Number(rawVal) : product.price;
    if (isNaN(newPrice) || newPrice < 0) return;

    if (!applyToAllBusinesses && newPrice === product.price) {
      return;
    }

    const searchName = product.name.trim().toLocaleLowerCase('tr-TR');
    let matchCount = 0;

    const updatedAllProducts = allProducts.map(p => {
      if (p.id === product.id) {
        matchCount++;
        return { ...p, price: newPrice };
      }
      if (applyToAllBusinesses && p.name.trim().toLocaleLowerCase('tr-TR') === searchName) {
        matchCount++;
        return { ...p, price: newPrice }; // Sadece fiyatı günceller, görsel ve açıklamaya dokunmaz
      }
      return p;
    });

    const success = await saveDataLocally('products', updatedAllProducts);
    if (success) {
      setAllProducts(updatedAllProducts);
      setQuickSaveStatus(prev => ({
        ...prev,
        [product.id]: applyToAllBusinesses ? `✓ ${matchCount} tesiste eşitlendi` : '✓ Kaydedildi'
      }));
      setTimeout(() => {
        setQuickSaveStatus(prev => {
          const copy = { ...prev };
          delete copy[product.id];
          return copy;
        });
      }, 2000);
    } else {
      alert('Fiyat kaydedilirken hata oluştu.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSaving(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: arrayBuffer,
        headers: { 'Content-Type': 'application/octet-stream' }
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      if (data.url) callback(data.url);
    } catch (err) {
      alert("Resim yüklenirken hata oluştu.");
    } finally {
      setIsSaving(false);
      e.target.value = '';
    }
  };

  const addNewBusiness = () => {
    setEditingBusiness({
      id: `biz_${generateId()}`,
      name: 'Yeni İşletme',
      description: '',
      address: '',
      imageUrl: '/assets/placeholder.jpg'
    });
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
      <div className="container" style={{ maxWidth: '1500px', width: '96%', paddingBottom: 'var(--space-2xl)' }}>
        <h1 style={{ padding: 'var(--space-md) 0' }}>Yönetim Paneli</h1>
        <p className="text-muted" style={{ marginBottom: 'var(--space-md)' }}>
          İşletmenin menüsünü düzenlemek için işletme kartına tıklayın. Sadece işletme detaylarını düzenlemek için "DÜZENLEMEK İÇİN TIKLA" butonuna basın.
        </p>
        
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <button className="btn" onClick={() => setEditingSettings(settings || {})} style={{ background: '#6c757d', color: '#fff' }}>
             ⚙️ Genel Ayarlar (Duyuru & Reklam)
          </button>
        </div>

        {editingSettings && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-primary)', background: '#fff' }}>
              <h3>Genel Ayarlar</h3>
              
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Anasayfa Duyuru / Kayan Yazı (Boşsa gizlenir):</label>
                <input 
                  type="text" 
                  value={editingSettings.announcement || ''} 
                  onChange={e => setEditingSettings({...editingSettings, announcement: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Örn: Yenilenen menümüzle hizmetinizdeyiz!"
                />
              </div>

              <div style={{ marginTop: 'var(--space-md)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 'bold' }}>
                  <input type="checkbox" checked={!!editingSettings.adPopupActive} onChange={e => setEditingSettings({...editingSettings, adPopupActive: e.target.checked})} />
                  Anasayfa Reklam/Popup Aktif Mi?
                </label>
              </div>

              <div style={{ marginTop: 'var(--space-sm)' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Popup Resim URL:</label>
                <input 
                  type="text" 
                  value={editingSettings.adPopupImageUrl || ''} 
                  onChange={e => setEditingSettings({...editingSettings, adPopupImageUrl: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  {editingSettings.adPopupImageUrl && (
                     <img src={editingSettings.adPopupImageUrl} alt="Önizleme" style={{ height: '60px', borderRadius: '4px' }} />
                  )}
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                     <input type="file" id="popupImageUpload" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, url => setEditingSettings({...editingSettings, adPopupImageUrl: url}))} />
                     <button className="btn" onClick={() => document.getElementById('popupImageUpload')?.click()} style={{ background: '#007bff', color: '#fff', fontSize: '0.8rem', padding: '6px 12px' }}>
                        📁 Bilgisayardan Yükle
                     </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-sm)' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Popup Tıklanınca Gidilecek Link (İsteğe bağlı):</label>
                <input 
                  type="text" 
                  value={editingSettings.adPopupLink || ''} 
                  onChange={e => setEditingSettings({...editingSettings, adPopupLink: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
                </button>
                <button className="btn" onClick={() => setEditingSettings(null)} style={{ background: '#e0e0e0', color: '#333' }}>
                  Kapat
                </button>
                {saveMessage && <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>{saveMessage}</span>}
              </div>
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={addNewBusiness} style={{ marginBottom: 'var(--space-xl)' }}>
          + Yeni İşletme Ekle
        </button>

        {editingBusiness && (
<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-primary)', background: '#fff' }}>
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
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>İşletme Linki (URL / Slug):</label>
              <input 
                type="text" 
                value={editingBusiness.slug || ''} 
                onChange={e => handleBusinessChange('slug', e.target.value)}
                placeholder="ornek-isletme-adi"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Boşluk yerine tire (-) kullanın. Değiştirilmezse mevcut ID kullanılır.</span>
            </div>

            <div style={{ marginTop: 'var(--space-sm)' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Sıralama Numarası (Örn: 1):</label>
              <input 
                type="number" 
                value={editingBusiness.order || ''} 
                onChange={e => handleBusinessChange('order', parseInt(e.target.value) || 99)}
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

            <div style={{ marginTop: 'var(--space-sm)' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>İşletme Görsel URL (Resim):</label>
              <input 
                type="text" 
                value={editingBusiness.imageUrl || ''} 
                onChange={e => handleBusinessChange('imageUrl', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                {editingBusiness.imageUrl && (
                   <img src={editingBusiness.imageUrl} alt="Önizleme" style={{ height: '60px', borderRadius: '4px' }} />
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                   <input type="file" id="bizImageUpload" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, url => handleBusinessChange('imageUrl', url))} />
                   <button className="btn" onClick={() => document.getElementById('bizImageUpload')?.click()} style={{ background: '#007bff', color: '#fff', fontSize: '0.8rem', padding: '6px 12px' }}>
                      📁 Bilgisayardan Yükle
                   </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleSaveBusiness} disabled={isSaving}>
                {isSaving ? 'Kaydediliyor...' : '💾 Bilgileri Kaydet'}
              </button>
              <button className="btn" onClick={() => setEditingBusiness(null)} style={{ background: '#e0e0e0', color: '#333' }}>
                İptal
              </button>
              {saveMessage && <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>{saveMessage}</span>}
              <button className="btn" onClick={handleDeleteBusiness} style={{ background: '#dc3545', color: '#fff', marginLeft: 'auto' }}>🗑️ Sil</button>
            </div>
</div>
        </div>
        )}

        <div style={{ margin: 'var(--space-md) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {businesses.map(b => (
            <div key={b.id} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setSelectedBusinessId(b.id); setSelectedCategoryId('ALL'); }}>
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
  const visibleCategories = selectedCategoryId === 'ALL'
    ? businessCategories
    : businessCategories.filter(c => c.id === selectedCategoryId);

  return (
    <div className="container" style={{ maxWidth: '1600px', width: '96%', paddingBottom: 'var(--space-2xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: 'var(--space-md) 0', borderBottom: '1px solid #e5e5e5', marginBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            className="btn" 
            onClick={() => setSelectedBusinessId(null)} 
            style={{ background: '#333', color: '#fff', padding: '6px 14px', fontSize: '0.9rem' }}
          >
            ← Tesis Seçimi
          </button>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{business?.name}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: '#555', background: '#fff8e1', border: '1px solid #ffe082', padding: '6px 12px', borderRadius: '8px' }}>
            💡 <b>Hızlı Fiyat:</b> Sol alttaki fiyata tıklayıp değiştirin, <b>Enter</b> veya <b>Tab</b> tuşuna basın. <b>🌍</b> butonu sadece fiyatı tüm tesislerde eşitler.
          </span>
          <button className="btn btn-primary" onClick={addNewCategory} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            + Yeni Kategori Ekle
          </button>
        </div>
      </div>

      {/* Yatay Kategori Sekmeleri */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 'var(--space-lg)', padding: '12px', background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', alignItems: 'center' }}>
        <button
          className="btn"
          onClick={() => setSelectedCategoryId('ALL')}
          style={{
            padding: '8px 16px',
            height: '52px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            background: selectedCategoryId === 'ALL' ? 'var(--color-primary)' : '#f1f3f5',
            color: selectedCategoryId === 'ALL' ? '#fff' : '#333',
            fontWeight: selectedCategoryId === 'ALL' ? 600 : 500
          }}
        >
          Tüm Kategoriler ({allProducts.filter(p => businessCategories.some(c => c.id === p.categoryId)).length})
        </button>
        {businessCategories.map(c => {
          const count = allProducts.filter(p => p.categoryId === c.id).length;
          const isActive = selectedCategoryId === c.id;
          return (
            <button
              key={c.id}
              className="btn"
              onClick={() => setSelectedCategoryId(c.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px 6px 6px',
                height: '52px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                background: isActive ? 'var(--color-primary)' : '#f1f3f5',
                color: isActive ? '#fff' : '#333',
                fontWeight: isActive ? 600 : 500,
                border: isActive ? '2px solid var(--color-primary-dark)' : '1px solid #e9ecef'
              }}
            >
              {c.imageUrl ? (
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    flexShrink: 0,
                    background: '#ddd'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#dee2e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: '#666',
                    flexShrink: 0
                  }}
                >
                  Yok
                </div>
              )}
              <span>{c.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {editingCategory && (
<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-primary)', background: '#fff' }}>
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

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Kategori Görsel URL (İsteğe bağlı):</label>
            <input 
              type="text" 
              value={editingCategory.imageUrl || ''} 
              onChange={e => handleCategoryChange('imageUrl', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              {editingCategory.imageUrl && (
                 <img src={editingCategory.imageUrl} alt="Önizleme" style={{ height: '60px', borderRadius: '4px' }} />
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                 <input type="file" id="catImageUpload" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, url => handleCategoryChange('imageUrl', url))} />
                 <button className="btn" onClick={() => document.getElementById('catImageUpload')?.click()} style={{ background: '#007bff', color: '#fff', fontSize: '0.8rem', padding: '6px 12px' }}>
                    📁 Bilgisayardan Yükle
                 </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handleSaveCategory} disabled={isSaving}>
              {isSaving ? 'Kaydediliyor...' : '💾 Kategoriyi Kaydet'}
            </button>
            <button className="btn" onClick={() => setEditingCategory(null)} style={{ background: '#e0e0e0', color: '#333' }}>
              İptal
            </button>
            {saveMessage && <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>{saveMessage}</span>}
              <button className="btn" onClick={handleDeleteCategory} style={{ background: '#dc3545', color: '#fff', marginLeft: 'auto' }}>🗑️ Sil</button>
            </div>
</div>
        </div>
      )}

      {editingProduct && (
<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-primary)', background: '#fff' }}>
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
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Detaylı Açıklama (Pop-up'ta görünür):</label>
            <textarea 
              value={editingProduct.longDescription || ''} 
              onChange={e => handleProductChange('longDescription', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>İçindekiler (Virgülle ayırın, Örn: Domates, Biber):</label>
            <input 
              type="text" 
              value={editingProduct.ingredients?.join(', ') || ''} 
              onChange={e => handleProductChange('ingredients', e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [])}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Alerjen Uyarısı (Virgülle ayırın, Örn: Süt ürünleri, Gluten):</label>
            <input 
              type="text" 
              value={editingProduct.allergens?.join(', ') || ''} 
              onChange={e => handleProductChange('allergens', e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [])}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px' }}>Özel Etiketler:</label>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={!!editingProduct.badges?.vegetarian} onChange={e => handleProductChange('badges', { ...editingProduct.badges, vegetarian: e.target.checked })} />
                Vejetaryen
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={!!editingProduct.badges?.vegan} onChange={e => handleProductChange('badges', { ...editingProduct.badges, vegan: e.target.checked })} />
                Vegan
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={!!editingProduct.badges?.glutenFree} onChange={e => handleProductChange('badges', { ...editingProduct.badges, glutenFree: e.target.checked })} />
                Glütensiz
              </label>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-sm)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Resim URL (Örn: /assets/cay.jpg):</label>
            <input 
              type="text" 
              value={editingProduct.imageUrl || ''} 
              onChange={e => handleProductChange('imageUrl', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              {editingProduct.imageUrl && (
                 <img src={editingProduct.imageUrl} alt="Önizleme" style={{ height: '60px', borderRadius: '4px' }} />
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                 <input type="file" id="imageUpload" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, url => handleProductChange('imageUrl', url))} />
                 <button className="btn" onClick={() => document.getElementById('imageUpload')?.click()} style={{ background: '#007bff', color: '#fff', fontSize: '0.8rem', padding: '6px 12px' }}>
                    📁 Bilgisayardan Yükle
                 </button>
              </div>
            </div>
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
              <button className="btn" onClick={handleDeleteProduct} style={{ background: '#dc3545', color: '#fff', marginLeft: 'auto' }}>🗑️ Sil</button>
            </div>
</div>
        </div>
      )}

      {visibleCategories.map(c => {
        const catProducts = allProducts.filter(p => p.categoryId === c.id);
        
        return (
          <div key={c.id} style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', background: '#ddd' }}
                  />
                )}
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{c.name}</h2>
                <button className="btn" onClick={() => setEditingCategory(c)} style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'var(--color-primary)', color: '#fff' }}>
                  Kategoriyi Düzenle
                </button>
              </div>
              <button className="btn" onClick={() => { addNewProduct(c.id); }} style={{ padding: '5px 12px', fontSize: '0.8rem', background: '#333', color: '#fff' }}>
                + Bu Kategoriye Yeni Ürün Ekle
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {catProducts.map(p => {
                const currentInputPrice = quickPrices[p.id] !== undefined ? quickPrices[p.id] : String(p.price);
                const isPriceDirty = Number(currentInputPrice) !== p.price;
                const statusMsg = quickSaveStatus[p.id];

                return (
                  <div
                    key={p.id}
                    style={{
                      position: 'relative',
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                      border: statusMsg ? '2px solid #28a745' : isPriceDirty ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ position: 'relative', height: '110px', width: '100%', background: '#eee' }}>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        <button
                          onClick={() => setEditingProduct(p)}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'var(--color-primary)',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                          }}
                        >
                          DÜZENLE
                        </button>
                      </div>

                      <div style={{ padding: '10px 10px 6px 10px' }}>
                        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 4px 0', lineHeight: 1.25 }}>
                          {p.name}
                        </h3>
                        {p.shortDescription && (
                          <p
                            className="text-muted"
                            style={{
                              fontSize: '0.75rem',
                              margin: 0,
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                            title={p.shortDescription}
                          >
                            {p.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sol Alt Hızlı Fiyat Düzenleme Alanı */}
                    <div style={{ padding: '6px 10px 10px 10px', borderTop: '1px solid #f1f3f5', marginTop: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: isPriceDirty ? '#fff8e1' : '#f8f9fa',
                            border: isPriceDirty ? '1px solid var(--color-primary)' : '1px solid #ced4da',
                            borderRadius: '8px',
                            padding: '2px 8px',
                            flex: 1
                          }}
                        >
                          <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem', marginRight: '2px' }}>₺</span>
                          <input
                            type="number"
                            value={currentInputPrice}
                            onChange={(e) => setQuickPrices(prev => ({ ...prev, [p.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                                handleQuickPriceSave(p, false);
                              }
                            }}
                            onBlur={() => {
                              if (isPriceDirty) {
                                handleQuickPriceSave(p, false);
                              }
                            }}
                            style={{
                              width: '100%',
                              border: 'none',
                              background: 'transparent',
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              color: '#1a1a1a',
                              outline: 'none',
                              padding: '3px 0'
                            }}
                            title="Fiyatı yazıp Enter veya Tab tuşuna basın"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickPriceSave(p, false)}
                          style={{
                            background: isPriceDirty ? '#28a745' : '#e9ecef',
                            color: isPriceDirty ? '#fff' : '#495057',
                            borderRadius: '8px',
                            padding: '6px 9px',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                          title="Sadece bu ürünü kaydet"
                        >
                          ✓
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickPriceSave(p, true)}
                          style={{
                            background: '#17a2b8',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '6px 8px',
                            fontSize: '0.8rem'
                          }}
                          title="Aynı isimli ürünlerin SADECE FİYATINI tüm tesislerde bu fiyata eşitle (Görsel ve açıklamaya dokunmaz)"
                        >
                          🌍
                        </button>
                      </div>

                      {statusMsg && (
                        <div style={{ fontSize: '0.72rem', color: '#28a745', fontWeight: 600, marginTop: '4px' }}>
                          {statusMsg}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
