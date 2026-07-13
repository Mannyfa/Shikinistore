import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  // Animation variants for staggered typography
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with slow scale-in */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full bg-luxury-charcoal"
      >
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Shikini Editorial Cover" 
          className="w-full h-full object-cover opacity-60"
        />
      </motion.div>

      {/* Hero Typography & CTA */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-4 mt-20"
      >
        <motion.span variants={item} className="text-luxury-gold text-xs md:text-sm uppercase tracking-[0.3em] mb-6 font-medium drop-shadow-md">
          Curated Authenticity
        </motion.span>
        
        <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl font-editorial text-white font-light tracking-tight mb-8 max-w-4xl leading-tight drop-shadow-lg">
          Redefining Pre-Owned <br />
          <span className="italic font-serif">Luxury.</span>
        </motion.h1>
        
        <motion.div variants={item}>
          <Link 
            to="/archives" 
            className="mt-4 px-10 py-4 bg-white text-luxury-black text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-all duration-500 inline-block drop-shadow-md"
          >
            Enter the Archives
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}