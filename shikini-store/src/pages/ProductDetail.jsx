import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProduct } from '../hooks/useProduct';
import { useCartStore } from '../store/cartStore'; // <-- NEW: Import cart store

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem); // <-- NEW: Get addItem function

  const handleAddToCart = () => {
    if (product) {
      addItem(product); // Add the item to the cart (which also opens the drawer!)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-sans tracking-widest uppercase text-xs">Accessing Vault Item...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-sans text-sm mb-2 uppercase tracking-widest">Archive Error</p>
        <p className="text-gray-500 text-xs max-w-sm mb-8">{error || 'Item not found.'}</p>
        <Link to="/archives" className="text-xs uppercase tracking-widest border-b border-luxury-black pb-1">Return to Archives</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-white pt-24 md:pt-32 pb-24 selection:bg-luxury-gold selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-12">
          <Link to="/archives" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-luxury-black transition-colors">
            ← Back to Archives
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-zinc-100 aspect-[4/5] relative overflow-hidden"
            >
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">{product.designer || product.category}</h1>
              <h2 className="text-4xl md:text-5xl font-editorial text-luxury-black mb-6 leading-tight">{product.name}</h2>
              
              <p className="text-lg tracking-widest mb-12">₦{product.price.toLocaleString()}</p>

              <div className="prose prose-sm text-zinc-600 mb-12 font-serif leading-relaxed">
                <p>{product.description}</p>
              </div>

              <div className="space-y-6 border-t border-zinc-200 pt-8">
                
                {/* Stock Status */}
                <div className="flex justify-between items-center text-xs uppercase tracking-widest">
                  <span className="text-zinc-500">Condition</span>
                  <span className="text-luxury-black">Pre-Owned / Excellent</span>
                </div>
                <div className="flex justify-between items-center text-xs uppercase tracking-widest">
                  <span className="text-zinc-500">Availability</span>
                  <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stock > 0 ? 'In Vault' : 'Archived'}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-5 mt-8 bg-luxury-black text-white text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Acquire Piece'}
                </button>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}