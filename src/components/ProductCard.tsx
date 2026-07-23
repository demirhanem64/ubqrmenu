import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <motion.div 
      className="product-card bg-surface"
      onClick={() => onClick(product.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="product-card-image">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc text-muted">{product.shortDescription}</p>
        <div className="product-footer">
          <span className="product-price text-primary">₺{product.price}</span>
          <div className="product-badges">
            {product.badges?.vegan && <span className="badge badge-vegan" title="Vegan">V</span>}
            {product.badges?.vegetarian && !product.badges.vegan && <span className="badge badge-veg" title="Vejetaryen">VG</span>}
            {product.badges?.glutenFree && <span className="badge badge-gf" title="Glutensiz">GF</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
