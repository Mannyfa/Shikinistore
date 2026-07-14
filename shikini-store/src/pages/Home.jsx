import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// 1. Your active local founder image
import founderImg from '../assets/founder.jpg';

// 2. Once you have a hero image, put it in the assets folder and uncomment this:
// import heroImg from '../assets/hero-bg.jpg';

export default function Home() {
  // Uses your local founder image
  const currentFounderImg = typeof founderImg !== 'undefined' 
    ? founderImg 
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Uses a placeholder until you uncomment the heroImg import above
  const currentHeroImg = typeof heroImg !== 'undefined'
    ? heroImg
    : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    viewport: { once: true, margin: "-100px" }
  };

  return (
    <div className="bg-luxury-white w-full">
      
      {/* 1. HERO SECTION (With Background Image & Overlay) */}
      <section 
        className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-zinc-100"
        style={{
          backgroundImage: `url(${currentHeroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Frosted Glass / Light Overlay to ensure black text is perfectly readable */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="z-10 relative"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-6 font-semibold">Welcome to</p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-editorial text-luxury-black tracking-tight mb-8">
            SHIKINI
          </h1>
          <p className="text-sm md:text-base font-serif italic text-zinc-700 max-w-lg mx-auto mb-12">
            A curated archive of pre-owned luxury, rare timepieces, and definitive designer garments.
          </p>
          <Link 
            to="/archives" 
            className="inline-block border-b border-luxury-black pb-1 text-xs uppercase tracking-widest text-luxury-black hover:text-zinc-500 hover:border-zinc-500 transition-colors"
          >
            Enter the Vault
          </Link>
        </motion.div>
      </section>

      {/* 2. BRAND PHILOSOPHY */}
      <section className="py-32 px-4 md:px-8 bg-zinc-50 text-center">
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="whileInView" viewport="viewport"
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-8">The Philosophy</h2>
          <p className="text-2xl md:text-4xl font-editorial text-luxury-black leading-relaxed">
            We believe true luxury does not age; it accrues character. Every piece in our archive is meticulously verified, restored, and curated for those who understand the permanence of style.
          </p>
        </motion.div>
      </section>

      {/* 3. ABOUT THE FOUNDER */}
      <section className="py-32 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Founder Image */}
          <motion.div 
            variants={fadeUp} initial="hidden" whileInView="whileInView" viewport="viewport"
            className="relative aspect-[3/4] bg-zinc-200 overflow-hidden"
          >
            <img 
              src={currentFounderImg} 
              alt="The Founder" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            {/* Elegant overlay frame */}
            <div className="absolute inset-4 border border-white/30 pointer-events-none" />
          </motion.div>

          {/* Founder Text */}
          <motion.div 
            variants={fadeUp} initial="hidden" whileInView="whileInView" viewport="viewport"
            className="flex flex-col justify-center"
          >
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6">The Visionary</h2>
            <h3 className="text-4xl md:text-5xl font-editorial text-luxury-black mb-8">Meet the Founder</h3>
            <div className="space-y-6 text-sm text-zinc-600 font-serif leading-relaxed">
              <p>
                Founded on the principle that exceptional design deserves a second act, Shikini was born out of a profound obsession with archival fashion and horology. 
              </p>
              <p>
                "I wanted to create a space that felt less like a retail store and more like a private gallery. A place where collectors and enthusiasts could discover garments and objects that have lived a life, yet still have so much more to give."
              </p>
              <p>
                Every single piece you see on this platform has been personally sourced, inspected, and approved by the founder. It is an intimate reflection of personal taste, brought to the world.
              </p>
            </div>
            
            {/* Signature / Sign-off */}
            <div className="mt-12 pt-12 border-t border-zinc-200">
              <p className="font-editorial text-2xl text-luxury-black">Adeyemi Funmilayo</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-2">Founder & Curator, Shikini</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. VIP CONCIERGE / NEWSLETTER */}
      <section className="bg-zinc-950 text-white py-32 px-4 text-center">
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="whileInView" viewport="viewport"
          className="max-w-xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-editorial mb-6">The Inner Circle</h2>
          <p className="text-xs font-serif text-zinc-400 mb-12">
            Join our private mailing list to receive exclusive access to new acquisitions before they are released to the public archive.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="bg-transparent border-b border-zinc-700 px-4 py-3 text-xs tracking-widest focus:outline-none focus:border-white transition-colors w-full sm:w-72"
            />
            <button 
              type="submit" 
              className="bg-white text-luxury-black px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              Request Access
            </button>
          </form>
        </motion.div>
      </section>

    </div>
  );
}