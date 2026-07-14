import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    phone: ''
  });

  // Analytics
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 15000 : 0; // Flat ₦15,000 luxury shipping rate
  const total = subtotal + shipping;

  // We save the final total in state so we can safely clear the cart 
  // without the success screen suddenly showing ₦0
  const [finalTotal, setFinalTotal] = useState(0);

  // Redirect if cart is empty and order isn't submitted
  useEffect(() => {
    if (items.length === 0 && !orderSubmitted) {
      navigate('/archives');
    }
  }, [items, navigate, orderSubmitted]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Lock in the total price before clearing the cart
    setFinalTotal(total);

    // Simulate a brief processing delay to generate the invoice
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSubmitted(true);
      clearCart();
    }, 1500);
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  // --- BANK TRANSFER / SUCCESS STATE ---
  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-luxury-white flex flex-col items-center justify-center p-4 py-24">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-editorial text-luxury-black mb-4">Complete Your Acquisition</h1>
            <p className="text-sm font-serif text-zinc-600 italic">
              Your order has been recorded. Please complete the transfer to secure your pieces.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-200 pb-8 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Total Amount Due</p>
                <p className="text-3xl font-editorial text-luxury-black">₦{finalTotal.toLocaleString()}</p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Order Status</p>
                <p className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Awaiting Payment</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Bank Name</p>
                <p className="text-lg font-medium text-luxury-black tracking-wide">Fidelity Bank</p>
              </div>
              
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Account Number</p>
                <p className="text-2xl font-mono text-luxury-black tracking-widest bg-zinc-200 inline-block px-4 py-2">6237839296</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Account Name</p>
                <p className="text-lg font-medium text-luxury-black uppercase tracking-widest">ADEYEMI FUNMILAYO</p>
              </div>
            </div>

            <div className="mt-12 bg-zinc-900 text-white p-6">
              <p className="text-xs uppercase tracking-widest mb-2 font-bold">Next Steps:</p>
              <ol className="list-decimal list-inside text-sm font-serif text-zinc-300 space-y-2">
                <li>Transfer the exact total amount to the account provided above.</li>
                <li>Use your name (<span className="font-sans font-bold">{formData.firstName} {formData.lastName}</span>) in the transfer description.</li>
                <li>Send your proof of payment via WhatsApp or Email to confirm your order.</li>
              </ol>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/archives" className="text-xs uppercase tracking-widest border-b border-luxury-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors">
              Return to Archives
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- CHECKOUT FORM STATE ---
  return (
    <div className="min-h-screen bg-luxury-white pt-24 md:pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        
        <div className="mb-12">
          <Link to="/archives" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-luxury-black transition-colors">
            ← Return to Vault
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Shipping & Contact Form */}
          <div className="lg:col-span-7">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h1 className="text-3xl font-editorial text-luxury-black mb-8">Secure Checkout</h1>
              
              <form onSubmit={handleCheckoutSubmit} className="space-y-10">
                
                {/* Contact Section */}
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-200 pb-2">Contact Information</h2>
                  <div className="relative group">
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder=" "
                      className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                    <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">Email Address</label>
                  </div>
                </section>

                {/* Shipping Section */}
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-200 pb-2">Shipping Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="relative group">
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder=" "
                        className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                      <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">First Name</label>
                    </div>
                    <div className="relative group">
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder=" "
                        className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                      <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">Last Name</label>
                    </div>
                  </div>

                  <div className="relative group mb-6">
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder=" "
                      className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                    <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">Delivery Address</label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="relative group">
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} placeholder=" "
                        className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                      <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">City</label>
                    </div>
                    <div className="relative group">
                      <input type="text" name="state" required value={formData.state} onChange={handleInputChange} placeholder=" "
                        className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                      <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">State / Province</label>
                    </div>
                  </div>

                  <div className="relative group">
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder=" "
                      className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                    <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">Phone Number</label>
                  </div>
                </section>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full py-5 mt-8 bg-luxury-black text-white text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    `Place Order & View Payment Details`
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-zinc-50 p-8 md:p-10 sticky top-32 border border-zinc-200"
            >
              <h2 className="text-xl font-editorial text-luxury-black mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-zinc-200 flex-shrink-0 relative">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                      <span className="absolute -top-2 -right-2 bg-luxury-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-xs font-medium text-luxury-black">{item.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{item.designer || item.category}</p>
                      <p className="text-xs mt-2">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-zinc-200 pt-6 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Insured Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-zinc-200 pt-6 mt-6">
                <span className="text-xs uppercase tracking-widest text-luxury-black">Total to Transfer</span>
                <span className="text-2xl font-editorial text-luxury-black">₦{total.toLocaleString()}</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}