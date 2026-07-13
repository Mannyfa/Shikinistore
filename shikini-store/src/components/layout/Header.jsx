import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../hooks/useCartStore';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { cart, openCart } = useCartStore(); 
  const location = useLocation(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  
  // If home AND menu is closed, text is white. Otherwise, black.
  const headerTextColor = (isHome && !isMobileMenuOpen) ? 'text-white drop-shadow-md' : 'text-luxury-black';

  // Lock background scrolling when the mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Auto-close the mobile menu when navigating to a new page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 px-6 md:px-8 py-6 flex items-center justify-between transition-colors duration-300 ${headerTextColor}`}>
        
        {/* Mobile Left: Hamburger Menu */}
        <div className="md:hidden flex-1 flex items-center">
          <button onClick={() => setIsMobileMenuOpen(true)} className="hover:opacity-70 transition-opacity">
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Desktop Left: Navigation */}
        <nav className="hidden md:flex flex-1 gap-8 text-xs uppercase tracking-widest font-medium">
          <Link to="/archives" className="hover:text-luxury-gold transition-colors duration-300">New Arrivals</Link>
          <Link to="/archives" className="hover:text-luxury-gold transition-colors duration-300">Designers</Link>
        </nav>
        
        {/* Center: Brand Mark (Centered on both mobile and desktop) */}
        <div className="flex-1 flex justify-center md:flex-none">
          <Link to="/" className="text-3xl md:text-4xl font-editorial font-bold tracking-widest text-center hover:opacity-80 transition-opacity">
            SHIKINI
          </Link>
        </div>
        
        {/* Right Actions */}
        <div className="flex flex-1 justify-end gap-6 text-xs uppercase tracking-widest font-medium items-center">
          <Link to="/auth" className="hover:text-luxury-gold transition-colors duration-300 hidden md:block">Sign In</Link>
          <button className="hover:text-luxury-gold transition-colors duration-300 hidden md:block">Search</button>
          <button 
            onClick={openCart} 
            className="hover:text-luxury-gold transition-colors duration-300"
          >
            Cart ({cart.length})
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-luxury-white text-luxury-black flex flex-col"
          >
            {/* Menu Header */}
            <div className="px-6 py-6 flex items-center justify-between border-b border-gray-200">
              <button onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-70 transition-opacity flex-1 flex">
                <X size={24} strokeWidth={1.5} />
              </button>
              <div className="flex-1 flex justify-center">
                <span className="text-3xl font-editorial font-bold tracking-widest">SHIKINI</span>
              </div>
              <div className="flex-1" /> {/* Spacer to perfectly center the logo */}
            </div>

            {/* Menu Links */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-10">
              <Link to="/" className="text-4xl font-editorial tracking-widest hover:text-luxury-gold transition-colors">Home</Link>
              <Link to="/archives" className="text-4xl font-editorial tracking-widest hover:text-luxury-gold transition-colors">The Archives</Link>
              <Link to="/archives" className="text-4xl font-editorial tracking-widest hover:text-luxury-gold transition-colors">Designers</Link>
              <Link to="/auth" className="text-4xl font-editorial tracking-widest hover:text-luxury-gold transition-colors">Sign In</Link>
            </nav>

            <div className="p-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
              Redefining Pre-Owned Luxury
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}