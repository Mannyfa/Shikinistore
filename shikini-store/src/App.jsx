import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProductGrid from './features/catalog/ProductGrid';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AuthPage from './pages/Auth';
import Profile from './pages/Profile'; // <-- 1. Import the new Profile page
import CartDrawer from './features/cart/CartDrawer';

function App() {
  return (
    <Router>
      <Header />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archives" element={
          <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
             <ProductGrid />
          </div>
        } />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* 2. Add the Profile Route here */}
        <Route path="/profile" element={<Profile />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;