"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Image from 'next/image';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 30 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] p-1 rounded-full bg-white/80 backdrop-blur-md shadow-xl border border-slate-200/50 hover:shadow-primary-blue/20 hover:-translate-y-1 transition-all duration-300 focus:outline-none flex items-center justify-center cursor-pointer overflow-hidden group"
          aria-label="Scroll to top"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Image 
              src="/Images/logo/Gemini_Generated_Image_38mz5x38mz5x38mz.png" 
              alt="Scroll to top" 
              width={40} 
              height={40} 
              className="group-hover:scale-110 transition-transform duration-300 rounded-lg"
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
