import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

export default function SearchOverlay({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  // Auto-focus the input when the overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
      setSearchTerm(''); // Clear previous searches
    }
  }, [isOpen]);

  // The Filter Engine
  const searchResults = products.filter((item) => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      (item.designer && item.designer.toLowerCase().includes(term)) ||
      item.category.toLowerCase().includes(term)
    );
  });

  const handleProductClick = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const overlayVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(16px)', transition: { duration: 0.4 } },
    exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.3 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 text-white overflow-y-auto">
          
          <motion.div variants={overlayVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 pointer-events-none" />

          <motion.div variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="relative z-10 flex-1 flex flex-col px-4 md:px-8 lg:px-12 py-12">
            
            {/* Header / Close Button */}
            <div className="flex justify-end mb-16">
              <button onClick={onClose} className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Close [X]
              </button>
            </div>

            {/* Massive Search Input */}
            <div className="max-w-4xl mx-auto w-full mb-16">
              <input
                ref={inputRef}
                type="text"
                placeholder="TYPE TO EXPLORE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-b-2 border-zinc-700 pb-4 text-4xl md:text-6xl lg:text-7xl font-editorial text-white placeholder-zinc-700 focus:outline-none focus:border-luxury-gold transition-colors"
              />
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-4">
                Search by Designer, Category, or Piece Name.
              </p>
            </div>

            {/* Results Grid */}
            <div className="max-w-6xl mx-auto w-full flex-1">
              {loading && searchTerm && (
                <p className="text-xs uppercase tracking-widest text-zinc-500 text-center animate-pulse">Consulting Vault...</p>
              )}
              
              {!loading && searchTerm && searchResults.length === 0 && (
                <p className="text-center text-zinc-500 font-serif italic text-lg">No pieces found matching your criteria.</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {searchResults.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleProductClick(item.id)}
                    className="group cursor-pointer block"
                  >
                    <div className="aspect-[3/4] bg-zinc-900 overflow-hidden mb-4 relative">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-luxury-gold mb-1">{item.designer || item.category}</p>
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-zinc-400 mt-1">₦{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}