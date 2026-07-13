import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

export default function ProductGrid() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-sans tracking-widest uppercase text-xs">Retrieving Archives...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <p className="text-red-500 font-sans text-sm mb-2 uppercase tracking-widest">Connection Error</p>
        <p className="text-gray-500 text-xs max-w-sm">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center border border-dashed border-gray-300 rounded p-8">
        <p className="text-luxury-black font-editorial text-xl mb-2">The Vault is Empty</p>
        <p className="text-gray-500 text-xs uppercase tracking-widest max-w-xs">
          The connection is active, but no items have been registered in the Firebase database yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
          className={`${index === 1 ? 'md:mt-16' : ''} ${index === 2 ? 'lg:mt-32' : ''}`}
        >
          <Link to={`/product/${product.id}`} className="group cursor-pointer block">
            
            <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 mb-6">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  loading="lazy" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs uppercase tracking-widest bg-black/60 px-4 py-2">Archived</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-start text-luxury-black">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-1">{product.designer || product.category}</h3>
                <p className="text-sm font-serif italic text-gray-600">{product.name}</p>
              </div>
              {/* Converted to Naira (₦) with local formatting */}
              <span className="text-sm tracking-widest font-medium">₦{product.price.toLocaleString()}</span>
            </div>

          </Link>
        </motion.div>
      ))}
    </div>
  );
}