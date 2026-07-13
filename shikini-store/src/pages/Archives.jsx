import React from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../features/catalog/ProductGrid'; 

export default function Archives() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-8 min-h-screen bg-luxury-white">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto mb-16 border-b border-gray-300 pb-8 flex flex-col md:flex-row justify-between items-end"
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-editorial text-luxury-black mb-2">The Archives</h1>
          <p className="text-sm font-sans uppercase tracking-widest text-gray-500">Curated Pre-Owned Pieces</p>
        </div>
        <div className="text-xs font-sans uppercase tracking-widest mt-6 md:mt-0 cursor-pointer hover:text-luxury-gold transition-colors">
          Filter / Sort +
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <ProductGrid /> 
      </div>

    </div>
  );
}