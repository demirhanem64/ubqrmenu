import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Business } from '../types';
import { getBusinesses } from '../services/dataService';
import BusinessCard from '../components/BusinessCard';
import { motion, AnimatePresence } from 'framer-motion';

const USAK_LOGO = "/logo.png";

const BusinessSelection: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const data = await getBusinesses();
      setBusinesses(data);
    };
    fetchBusinesses();

    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

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
              onClick={(id) => navigate(`/${id}`)}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default BusinessSelection;
