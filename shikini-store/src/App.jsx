import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Archives from './pages/Archives';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import CartDrawer from './features/cart/CartDrawer';
import SmoothScroll from './components/layout/SmoothScroll';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Import the new real Admin Dashboard!
import AdminDashboard from './pages/AdminDashboard'; 

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Router>
      <SmoothScroll>
        <div className="min-h-screen bg-luxury-white text-luxury-black font-sans antialiased selection:bg-luxury-gold selection:text-white relative">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Route>
            
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* SECURE ADMIN ROUTE connected to the new UI */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

          </Routes>
          
          <CartDrawer /> 
        </div>
      </SmoothScroll>
    </Router>
  );
}

export default App;