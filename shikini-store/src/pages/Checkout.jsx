import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../hooks/useCartStore';

export default function Checkout() {
  const { cart } = useCartStore();

  const subtotal = cart.reduce((total, item) => {
    const priceNumber = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return total + (priceNumber * item.quantity);
  }, 0);

  const shipping = 0; // Complimentary luxury shipping
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-luxury-white flex flex-col md:flex-row">
      
      {/* Left Column: Checkout Form */}
      <div className="w-full md:w-3/5 p-8 md:p-16 lg:px-32 xl:px-48 md:py-20 flex flex-col">
        {/* Secure Header */}
        <div className="mb-12">
          <Link to="/" className="text-3xl font-editorial font-bold tracking-widest text-luxury-black">
            SHIKINI
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-800 rounded-full"></span>
            Secure Encrypted Checkout
          </p>
        </div>

        {/* Breadcrumb Steps */}
        <div className="flex gap-4 text-xs uppercase tracking-widest mb-12">
          <span className="text-luxury-black font-bold">Information</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">Shipping</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">Payment</span>
        </div>

        <form className="space-y-12 flex-1" onSubmit={(e) => e.preventDefault()}>
          
          {/* Contact Section */}
          <section>
            <h2 className="text-lg font-editorial mb-6 text-luxury-black">Contact Information</h2>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-luxury-black focus:outline-none focus:border-luxury-black transition-colors placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400"
              />
            </div>
          </section>

          {/* Shipping Section */}
          <section>
            <h2 className="text-lg font-editorial mb-6 text-luxury-black">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1 relative">
                <input type="text" placeholder="First Name" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-luxury-black focus:outline-none focus:border-luxury-black transition-colors placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400" />
              </div>
              <div className="col-span-1 relative">
                <input type="text" placeholder="Last Name" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-luxury-black focus:outline-none focus:border-luxury-black transition-colors placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400" />
              </div>
              <div className="col-span-2 relative">
                <input type="text" placeholder="Address" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-luxury-black focus:outline-none focus:border-luxury-black transition-colors placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400" />
              </div>
              <div className="col-span-1 relative">
                <input type="text" placeholder="City" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-luxury-black focus:outline-none focus:border-luxury-black transition-colors placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400" />
              </div>
              <div className="col-span-1 relative">
                <input type="text" placeholder="Postal Code" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-luxury-black focus:outline-none focus:border-luxury-black transition-colors placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest placeholder:text-gray-400" />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="pt-8 flex justify-between items-center border-t border-gray-200">
            <Link to="/archives" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-luxury-black transition-colors">
              Return to Archives
            </Link>
            <button className="bg-luxury-black text-white px-10 py-5 text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors duration-300 shadow-xl">
              Continue to Shipping
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Order Summary (Sticky) */}
      <div className="w-full md:w-2/5 bg-gray-50 border-l border-gray-200 p-8 md:p-16 md:py-20 flex flex-col">
        <h2 className="text-lg font-editorial mb-8 text-luxury-black">Order Summary</h2>
        
        {/* Items */}
        <div className="flex-1 overflow-y-auto mb-8 pr-4">
          {cart.length === 0 ? (
            <p className="text-xs uppercase tracking-widest text-gray-400">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative h-20 w-16 bg-gray-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-luxury-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.designer}</h4>
                    <h3 className="text-sm font-serif italic text-luxury-black">{item.name}</h3>
                  </div>
                  <span className="text-sm tracking-widest">{item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-600 tracking-widest">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 tracking-widest">
            <span>Shipping</span>
            <span className="uppercase text-[10px] text-luxury-gold font-bold">Complimentary</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
            <span className="text-xs uppercase tracking-widest text-luxury-black">Total</span>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 mr-2 uppercase">USD</span>
              <span className="text-2xl tracking-widest text-luxury-black font-medium">
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}