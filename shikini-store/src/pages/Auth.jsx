import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Your frontend Firebase config

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Firebase Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/archives'); // Route to archives on success
      } else {
        // Firebase Registration
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        // Note: You could also save the user's name to Firestore here
        navigate('/archives'); 
      }
    } catch (err) {
      console.error("Auth Error:", err);
      // Clean up Firebase error messages for the user
      const message = err.message.includes('auth/invalid-credential') 
        ? 'Invalid email or password.' 
        : err.message.includes('auth/email-already-in-use')
        ? 'This email is already registered to the archives.'
        : 'An error occurred. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for the shifting form
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex bg-luxury-white">
      
      {/* Left Column: Full Bleed Editorial Image (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-zinc-900">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1974&auto=format&fit=crop" 
          alt="Shikini Archives Vault"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}
        
        <div className="absolute top-12 left-12">
          <Link to="/" className="text-white text-2xl font-editorial tracking-widest">
            SHIKINI
          </Link>
        </div>
        
        <div className="absolute bottom-12 left-12 text-white">
          <p className="text-xs font-mono uppercase tracking-widest mb-2 opacity-70">The Vault</p>
          <h2 className="text-3xl font-editorial max-w-sm">Secure access to curated luxury.</h2>
        </div>
      </div>

      {/* Right Column: The Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 relative">
        
        {/* Mobile Logo & Back Button */}
        <Link to="/" className="absolute top-8 left-8 text-xs uppercase tracking-widest text-zinc-400 hover:text-luxury-black transition-colors">
          ← Return
        </Link>

        <div className="w-full max-w-md">
          {/* Toggle Header */}
          <div className="flex justify-between items-end mb-16 border-b border-zinc-200 pb-4">
            <h1 className="text-3xl font-editorial text-luxury-black">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-xs uppercase tracking-widest text-zinc-400 hover:text-luxury-black transition-colors"
            >
              {isLogin ? 'Register Instead' : 'Login Instead'}
            </button>
          </div>

          {/* Form Area with Framer Motion Crossfade */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.form 
                key={isLogin ? 'login' : 'register'}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="space-y-8 absolute w-full"
              >
                
                {/* Registration Name Field (Only shows when registering) */}
                {!isLogin && (
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=" "
                      className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer"
                    />
                    <label className="absolute left-0 top-3 text-xs uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-luxury-black peer-valid:-top-4 peer-valid:text-[10px]">
                      Full Name
                    </label>
                  </div>
                )}

                {/* Email Field */}
                <div className="relative group">
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer"
                  />
                  <label className="absolute left-0 top-3 text-xs uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-luxury-black peer-valid:-top-4 peer-valid:text-[10px]">
                    Email Address
                  </label>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer"
                  />
                  <label className="absolute left-0 top-3 text-xs uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-luxury-black peer-valid:-top-4 peer-valid:text-[10px]">
                    Password
                  </label>
                </div>

                {/* Error Messaging */}
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-red-500 text-xs tracking-widest mt-4"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 mt-8 bg-luxury-black text-white text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isLogin ? 'Access Vault' : 'Create Account'
                  )}
                </button>

              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}