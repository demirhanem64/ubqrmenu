import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <header className="header glass">
      {showBack && (
        <button className="btn-icon header-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
      )}
      <motion.h1 
        className="header-title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h1>
      {showBack && <div className="header-spacer" />}
    </header>
  );
};

export default Header;
