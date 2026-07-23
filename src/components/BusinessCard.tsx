import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Business } from '../types';
import './BusinessCard.css';

interface BusinessCardProps {
  business: Business;
  onClick: (id: string) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  return (
    <motion.div 
      className="business-card bg-surface"
      onClick={() => onClick(business.id)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="business-card-image">
        <img src={business.imageUrl} alt={business.name} loading="lazy" />
        <div className="business-card-overlay glass">
          <h2 className="business-card-title">{business.name}</h2>
          <ChevronRight className="business-card-icon" />
        </div>
      </div>
      <div className="business-card-content">
        <p className="business-card-desc text-muted">{business.description}</p>
      </div>
    </motion.div>
  );
};

export default BusinessCard;
