import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Layout & Global Components
import Header from './components/layout/Header';
import CartDrawer from './features/cart/CartDrawer';
import SmoothScroll from './components/layout/SmoothScroll';

// Pages
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProductGrid from './features/catalog/ProductGrid';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AuthPage from './pages/Auth';
import Profile from './pages/Profile';

// --- THE CINEMATIC WRAPPER ---
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    exit={{ opacity: 0, filter: 'blur(8px)', y: -15 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
);

// --- INNER APP LOGIC ---
const AppContent = () => {
  const location = useLocation();
  
  // We check if the current page is the Admin Dashboard
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-luxury-white text-luxury-black font-sans antialiased selection:bg-luxury-gold selection:text-white relative">
      
      {/* Hide the public Header if we are in the Admin Terminal */}
      {!isAdminRoute && <Header />}
      
      <CartDrawer />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          
          <Route path="/archives" element={
            <AnimatedPage>
              <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
                <ProductGrid />
              </div>
            </AnimatedPage>
          } />
          
          <Route path="/product/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
          <Route path="/auth" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
          
          {/* Admin Terminal */}
          <Route path="/admin" element={<AdminDashboard />} />

        </Routes>
      </AnimatePresence>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <Router>
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </Router>
  );
}