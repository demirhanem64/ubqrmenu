import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Business, Settings } from '../types';
import { getBusinesses, getSettings } from '../services/dataService';
import BusinessCard from '../components/BusinessCard';
import { motion, AnimatePresence } from 'framer-motion';

const USAK_LOGO = "/logo.png";

const BusinessSelection: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showAdPopup, setShowAdPopup] = useState(() => !sessionStorage.getItem('adPopupClosed'));
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splashPlayed'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const data = await getBusinesses();
      setBusinesses(data);
      const s = await getSettings();
      setSettings(s);
    };
    fetchBusinesses();

    if (showSplash) {
      sessionStorage.setItem('splashPlayed', 'true');
      const timer = setTimeout(() => setShowSplash(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="splash-screen bg-surface"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.img 
              src={USAK_LOGO} 
              alt="Uşak Belediyesi Logo" 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
              style={{ width: '180px', marginBottom: 'var(--space-xl)' }}
            />
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ textAlign: 'center', fontSize: '1.5rem', margin: 0, color: 'var(--color-text)' }}
            >
              Uşak Belediyesi
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 400, color: 'var(--color-text-muted)' }}
            >
              Sosyal Tesisler
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: '8px' }}
            >
              QR MENU
            </motion.h3>
          </motion.div>
        )}
      </AnimatePresence>

      
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
                onClick={() => {
                  sessionStorage.setItem('adPopupClosed', 'true');
                  setShowAdPopup(false);
                }}
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

      <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
        
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
            style={{ marginTop: 'var(--space-md)', padding: '10px 0', background: 'transparent', color: 'red', borderRadius: '4px', overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', boxSizing: 'border-box' }}>
               <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'marquee 9.5s linear infinite', fontSize: '1rem', fontWeight: 500 }}>
                 {settings.announcement}
               </div>
               <style>{`
                 @keyframes marquee {
                   0%   { transform: translate(0, 0); }
                   100% { transform: translate(-100%, 0); }
                 }
               `}</style>
            </div>

          </motion.div>
        )}

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: showSplash ? 3.3 : 0.4, duration: 0.6 }}
          style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-lg)' }}
        >
          <h2 style={{ fontSize: '1.4rem' }}>İşletmenizi Seçin</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: showSplash ? 3.5 : 0.5, duration: 0.5 }}
        >
          {businesses.map((business) => (
            <BusinessCard 
              key={business.id} 
              business={business} 
              onClick={(id) => {
                sessionStorage.removeItem(`activeCategory_${id}`);
                navigate(`/${id}`);
              }}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default BusinessSelection;
