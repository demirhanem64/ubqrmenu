const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessSelection.tsx', 'utf-8');

// 1. Imports
content = content.replace(
  "import type { Business } from '../types';",
  "import type { Business, Settings } from '../types';"
);
content = content.replace(
  "import { getBusinesses } from '../services/dataService';",
  "import { getBusinesses, getSettings } from '../services/dataService';"
);

// 2. States
content = content.replace(
  "const [businesses, setBusinesses] = useState<Business[]>([]);",
  "const [businesses, setBusinesses] = useState<Business[]>([]);\n  const [settings, setSettings] = useState<Settings | null>(null);\n  const [showAdPopup, setShowAdPopup] = useState(true);"
);

// 3. fetch data
content = content.replace(
  "const data = await getBusinesses();\n      setBusinesses(data);",
  "const data = await getBusinesses();\n      setBusinesses(data);\n      const s = await getSettings();\n      setSettings(s);"
);

// 4. UI: Marquee and Popup
const headerReplacement = `
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showSplash ? 3.0 : 0.2, duration: 0.6 }}
          style={{ padding: 'var(--space-xl) 0 0', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}
        >
          <img src={USAK_LOGO} alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
          <div>
            <h1 style={{ fontSize: '1.2rem', marginBottom: '2px', lineHeight: 1.2 }}>Uşak Belediyesi</h1>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0, color: 'var(--color-text-muted)' }}>İşletme ve İştirakler Müdürlüğü</h2>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 400, margin: 0, color: 'var(--color-primary)' }}>Sosyal Tesisler QR MENU</h3>
          </div>
        </motion.div>

        {settings?.announcement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: showSplash ? 3.2 : 0.3, duration: 0.6 }}
            style={{ marginTop: 'var(--space-md)', padding: '10px 0', background: 'var(--color-primary)', color: '#fff', borderRadius: '4px', overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            <marquee scrollamount="5" style={{ fontSize: '1rem', fontWeight: 500 }}>{settings.announcement}</marquee>
          </motion.div>
        )}
`;
content = content.replace(
  /<motion\.div \n          initial=\{\{ opacity: 0, y: -20 \}\}[\s\S]*?<\/motion\.div>/,
  headerReplacement
);

// Popup before container
const popupHTML = `
      <AnimatePresence>
        {!showSplash && settings?.adPopupActive && settings?.adPopupImageUrl && showAdPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9998,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}
          >
            <div style={{ position: 'relative', maxWidth: '400px', width: '100%', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
              <button 
                onClick={() => setShowAdPopup(false)}
                style={{
                  position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px',
                  borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 'none', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10
                }}
              >
                &times;
              </button>
              {settings.adPopupLink ? (
                <a href={settings.adPopupLink} target="_blank" rel="noopener noreferrer">
                  <img src={settings.adPopupImageUrl} alt="Duyuru" style={{ width: '100%', display: 'block' }} />
                </a>
              ) : (
                <img src={settings.adPopupImageUrl} alt="Duyuru" style={{ width: '100%', display: 'block' }} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
`;

content = content.replace("<div className=\"container\"", popupHTML + "\n      <div className=\"container\"");

fs.writeFileSync('src/pages/BusinessSelection.tsx', content);
console.log('Update complete.');
