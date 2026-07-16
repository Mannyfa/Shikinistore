import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Log in existing user
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        // --- SMART ROUTING LOGIC ---
        if (userCredential.user.email === 'admin@shikini.com') {
          navigate('/admin'); // Send admin directly to terminal
        } else {
          navigate('/archives'); // Send customer to vault
        }
      } else {
        // Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        if (userCredential.user.email === 'admin@shikini.com') {
          navigate('/admin');
        } else {
          navigate('/profile'); 
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-luxury-white flex items-center justify-center px-4 py-24">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-md w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-editorial text-luxury-black mb-4">
            {isLogin ? 'Access the Vault' : 'Join the Inner Circle'}
          </h1>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            {isLogin ? 'Enter your credentials to continue.' : 'Create a private account to secure pieces.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 text-xs tracking-widest text-center uppercase">
              {error.replace('Firebase: ', '')}
            </div>
          )}

          <div className="relative group">
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder=" " 
              className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" 
            />
            <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">
              Email Address
            </label>
          </div>

          <div className="relative group">
            <input 
              type="password" 
              name="password" 
              required 
              value={formData.password} 
              onChange={handleInputChange} 
              placeholder=" " 
              className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" 
            />
            <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">
              Password
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-luxury-black text-white text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors disabled:bg-zinc-300 flex justify-center items-center"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-luxury-black transition-colors"
          >
            {isLogin ? 'New Client? Request Access here.' : 'Already a member? Sign in here.'}
          </button>
        </div>
        
      </motion.div>
    </div>
  );
}