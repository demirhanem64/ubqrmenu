const fs = require('fs');
let content = fs.readFileSync('src/pages/TestPage.tsx', 'utf-8');

// 1. Imports
content = content.replace(
  "import type { Business, Product, Category } from '../types';",
  "import type { Business, Product, Category, Settings } from '../types';"
);
content = content.replace(
  "import { getBusinesses, saveDataLocally } from '../services/dataService';",
  "import { getBusinesses, getSettings, saveDataLocally } from '../services/dataService';"
);

// 2. States
content = content.replace(
  "const [allProducts, setAllProducts] = useState<Product[]>([]);",
  "const [allProducts, setAllProducts] = useState<Product[]>([]);\n  const [settings, setSettings] = useState<Settings | null>(null);\n  const [editingSettings, setEditingSettings] = useState<Settings | null>(null);"
);

// 3. loadAll
content = content.replace(
  "setAllProducts(JSON.parse(p));\n  };",
  "setAllProducts(JSON.parse(p));\n    \n    const s = (await import('../data/settings.json?raw')).default;\n    setSettings(JSON.parse(s));\n  };"
);

// 4. Delete and Settings Handlers
const handlers = `
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
`;
content = content.replace("const handleApplyToAll = async () => {", handlers + "\n  const handleApplyToAll = async () => {");

// 5. Modal Style helper string
const modalStyleOpen = `<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>\n          <div className="glass" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-primary)', background: '#fff' }}>`;
const modalStyleClose = `</div>\n        </div>`;

// 6. Settings Form UI
const settingsFormUI = `
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
`;
content = content.replace(
  '<button className="btn btn-primary" onClick={addNewBusiness} style={{ marginBottom: \'var(--space-xl)\' }}>\n          + Yeni İşletme Ekle\n        </button>',
  settingsFormUI + '\n        <button className="btn btn-primary" onClick={addNewBusiness} style={{ marginBottom: \'var(--space-xl)\' }}>\n          + Yeni İşletme Ekle\n        </button>'
);

// 7. Modals and Delete buttons
content = content.replace(
  '{editingBusiness && (\n          <div className="glass" style={{ padding: \'var(--space-md)\', borderRadius: \'var(--radius-md)\', marginBottom: \'var(--space-md)\', border: \'2px solid var(--color-primary)\' }}>',
  '{editingBusiness && (\n' + modalStyleOpen
);
content = content.replace(
  '{saveMessage && <span style={{ marginLeft: \'10px\', fontSize: \'0.9rem\' }}>{saveMessage}</span>}\n            </div>\n          </div>\n        )}',
  '{saveMessage && <span style={{ marginLeft: \'10px\', fontSize: \'0.9rem\' }}>{saveMessage}</span>}\n              <button className="btn" onClick={handleDeleteBusiness} style={{ background: \'#dc3545\', color: \'#fff\', marginLeft: \'auto\' }}>🗑️ Sil</button>\n            </div>\n' + modalStyleClose + '\n        )}'
);

content = content.replace(
  '{editingCategory && (\n        <div className="glass" style={{ padding: \'var(--space-md)\', borderRadius: \'var(--radius-md)\', marginBottom: \'var(--space-xl)\', border: \'2px solid var(--color-primary)\' }}>',
  '{editingCategory && (\n' + modalStyleOpen
);
content = content.replace(
  '{saveMessage && <span style={{ marginLeft: \'10px\', fontSize: \'0.9rem\' }}>{saveMessage}</span>}\n          </div>\n        </div>\n      )}',
  '{saveMessage && <span style={{ marginLeft: \'10px\', fontSize: \'0.9rem\' }}>{saveMessage}</span>}\n              <button className="btn" onClick={handleDeleteCategory} style={{ background: \'#dc3545\', color: \'#fff\', marginLeft: \'auto\' }}>🗑️ Sil</button>\n            </div>\n' + modalStyleClose + '\n      )}'
);

content = content.replace(
  '{editingProduct && (\n        <div id="product-editor" className="glass" style={{ padding: \'var(--space-md)\', borderRadius: \'var(--radius-md)\', marginBottom: \'var(--space-xl)\', border: \'2px solid var(--color-primary)\' }}>',
  '{editingProduct && (\n' + modalStyleOpen
);
content = content.replace(
  '{saveMessage && <span style={{ marginLeft: \'10px\', fontSize: \'0.9rem\' }}>{saveMessage}</span>}\n          </div>\n        </div>\n      )}',
  '{saveMessage && <span style={{ marginLeft: \'10px\', fontSize: \'0.9rem\' }}>{saveMessage}</span>}\n              <button className="btn" onClick={handleDeleteProduct} style={{ background: \'#dc3545\', color: \'#fff\', marginLeft: \'auto\' }}>🗑️ Sil</button>\n            </div>\n' + modalStyleClose + '\n      )}'
);

content = content.replace(/setTimeout\(\(\) => document\.getElementById\('product-editor'\)\?\.scrollIntoView\(\), 100\);/g, "");


fs.writeFileSync('src/pages/TestPage.tsx', content);
console.log('Update complete.');
