import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth'; 

export default function Header() {
  const openCart = useCartStore((state) => state.openCart);
  const getCartCount = useCartStore((state) => state.getCartCount);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // SMART ROUTING LOGIC: Determine where the "Account" button should go
  const isAdmin = currentUser?.email === 'test@shikini.com';
  const accountRoute = isAdmin ? '/admin' : '/profile';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 lg:px-12 py-6 flex items-center justify-between ${
        isScrolled ? 'bg-luxury-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent'
      }`}
    >
      <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-widest text-zinc-500">
        <Link to="/archives" className="hover:text-luxury-black transition-colors">New Arrivals</Link>
        <Link to="/archives" className="hover:text-luxury-black transition-colors">Designers</Link>
      </nav>

      <Link to="/" className="text-2xl md:text-3xl font-editorial tracking-widest text-luxury-black absolute left-1/2 -translate-x-1/2">
        SHIKINI
      </Link>

      <nav className="flex items-center gap-6 md:gap-8 text-[10px] uppercase tracking-widest text-zinc-500">
        
        {/* --- DYNAMIC AUTH LINK --- */}
        {currentUser ? (
          <Link to={accountRoute} className="hover:text-luxury-black transition-colors hidden sm:block">
            Account
          </Link>
        ) : (
          <Link to="/auth" className="hover:text-luxury-black transition-colors hidden sm:block">
            Sign In
          </Link>
        )}

        <button className="hover:text-luxury-black transition-colors hidden sm:block">Search</button>
        
        <button 
          onClick={openCart}
          className="hover:text-luxury-black transition-colors flex items-center gap-1 font-medium"
        >
          Cart ({getCartCount()})
        </button>
      </nav>
    </header>
  );
}