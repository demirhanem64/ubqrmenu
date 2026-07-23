import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BusinessSelection from './pages/BusinessSelection';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';
import TestPage from './pages/TestPage';

const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<BusinessSelection />} />
        {import.meta.env.DEV && <Route path="/test" element={<TestPage />} />}
        <Route path="/:businessId" element={<Menu />} />
        <Route path="/:businessId/product/:productId" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
