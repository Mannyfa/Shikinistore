import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { 
    isOpen, 
    closeCart, 
    items, 
    updateQuantity, 
    removeItem, 
    getCartTotal 
  } = useCartStore();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  // Animation Variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const drawerVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { x: '100%', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          
          {/* Dark Background Overlay (Clicking it closes the cart) */}
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />

          {/* The Drawer */}
          <motion.div 
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-luxury-white h-full flex flex-col shadow-2xl"
          >
            
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-zinc-200">
              <h2 className="text-2xl font-editorial text-luxury-black">Your Cart</h2>
              <button 
                onClick={closeCart}
                className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-luxury-black transition-colors"
              >
                Close [X]
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400">
                  <p className="font-editorial text-xl text-luxury-black mb-2">The Cart is Empty</p>
                  <p className="text-[10px] uppercase tracking-widest">Explore the archives to acquire pieces.</p>
                  <button 
                    onClick={closeCart}
                    className="mt-8 border-b border-zinc-400 pb-1 text-xs uppercase tracking-widest hover:text-luxury-black hover:border-luxury-black transition-all"
                  >
                    Return to Vault
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6">
                      
                      {/* Item Image */}
                      <div className="w-24 h-32 bg-zinc-100 flex-shrink-0 relative overflow-hidden">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500">{item.designer || item.category}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-[10px] uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-sm font-medium text-luxury-black leading-snug pr-4">{item.name}</p>
                          <p className="text-sm tracking-widest mt-2">₦{item.price.toLocaleString()}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-4">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-400">Qty</span>
                          <div className="flex items-center border border-zinc-200">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-3 py-1 text-zinc-400 hover:text-luxury-black transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-3 py-1 text-zinc-400 hover:text-luxury-black transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-8 border-t border-zinc-200 bg-zinc-50">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-xs uppercase tracking-widest text-zinc-500">Subtotal</span>
                  <span className="text-2xl font-editorial text-luxury-black">₦{getCartTotal().toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-6">Taxes and shipping calculated at checkout.</p>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-5 bg-luxury-black text-white text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors flex justify-center items-center"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}