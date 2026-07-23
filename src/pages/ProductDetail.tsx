import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { getProductById } from '../services/dataService';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      const p = await getProductById(productId);
      if (p) setProduct(p);
    };
    fetchProduct();
  }, [productId]);

  if (!product) return null;

  return (
    <div className="product-detail">
      <button className="btn-icon back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      <motion.div 
        className="product-detail-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {product.videoUrl ? (
          <video src={product.videoUrl} autoPlay loop muted playsInline className="hero-media" />
        ) : (
          <img src={product.imageUrl} alt={product.name} className="hero-media" />
        )}
        <div className="hero-overlay"></div>
      </motion.div>

      <motion.div 
        className="container product-detail-content bg-surface"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: -30, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="detail-header">
          <h1 className="detail-title">{product.name}</h1>
          <span className="detail-price text-primary">₺{product.price}</span>
        </div>

        {product.weight && (
          <p className="detail-weight text-muted">{product.weight}</p>
        )}

        <div className="product-badges detail-badges">
          {product.badges?.vegan && <span className="badge badge-vegan" title="Vegan">Vegan</span>}
          {product.badges?.vegetarian && !product.badges.vegan && <span className="badge badge-veg" title="Vejetaryen">Vejetaryen</span>}
          {product.badges?.glutenFree && <span className="badge badge-gf" title="Glutensiz">Glutensiz</span>}
        </div>

        <p className="detail-desc">{product.longDescription || product.shortDescription}</p>

        {product.ingredients && product.ingredients.length > 0 && (
          <div className="detail-section">
            <h3>İçindekiler</h3>
            <p className="text-muted">{product.ingredients.join(', ')}</p>
          </div>
        )}

        {product.allergens && product.allergens.length > 0 && (
          <div className="detail-section">
            <h3 style={{ color: '#d32f2f' }}>Alerjen Uyarısı</h3>
            <p className="text-muted">{product.allergens.join(', ')}</p>
          </div>
        )}
        
        <div className="detail-actions">
          <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ width: '100%' }}>
            Menüye Dön
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
