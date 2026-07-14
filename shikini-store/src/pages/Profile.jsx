import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  // If a user somehow accesses this page without being logged in, show a loading state 
  // (Your routing should ideally catch this, but this is a safe fallback)
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-white">
        <div className="w-8 h-8 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-white pt-32 pb-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-16">
          <h1 className="text-4xl md:text-5xl font-editorial text-luxury-black mb-4">Client Portal</h1>
          <p className="text-sm font-serif italic text-zinc-600">
            Manage your acquisitions and personal details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Column: Account Details & Actions */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-1 space-y-12">
            
            <div>
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-200 pb-2">Profile Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400">Email Address</p>
                  <p className="text-sm font-medium text-luxury-black">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400">Account Status</p>
                  <p className="text-xs font-bold text-luxury-gold uppercase tracking-widest">Verified Member</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-200 pb-2">Session Management</h2>
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-zinc-100 text-luxury-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors border border-zinc-200"
              >
                Secure Sign Out
              </button>
            </div>
          </motion.div>

          {/* Right Column: Order History */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2">
            <h2 className="text-[10px] uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-200 pb-2">Acquisition History</h2>
            
            {/* Empty State for Orders */}
            <div className="bg-zinc-50 border border-zinc-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <p className="font-editorial text-2xl text-luxury-black mb-2">No Past Acquisitions</p>
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-8 max-w-xs mx-auto">
                Your private archive is currently empty. Explore the vault to secure your first piece.
              </p>
              <button 
                onClick={() => navigate('/archives')}
                className="border-b border-luxury-black pb-1 text-xs uppercase tracking-widest text-luxury-black hover:text-zinc-500 hover:border-zinc-500 transition-colors"
              >
                Enter the Vault
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}