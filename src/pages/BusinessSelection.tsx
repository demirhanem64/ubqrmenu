import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Business } from '../types';
import { getBusinesses } from '../services/dataService';
import BusinessCard from '../components/BusinessCard';
import { motion } from 'framer-motion';

const BusinessSelection: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const data = await getBusinesses();
      setBusinesses(data);
    };
    fetchBusinesses();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: 'var(--space-xl) 0', textAlign: 'center' }}
      >
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>İşletmenizi Seçiniz</h1>
        <p className="text-muted">Lütfen menüsünü görüntülemek istediğiniz işletmeyi seçin.</p>
      </motion.div>
      
      <div>
        {businesses.map((business) => (
          <BusinessCard 
            key={business.id} 
            business={business} 
            onClick={(id) => navigate(`/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default BusinessSelection;
