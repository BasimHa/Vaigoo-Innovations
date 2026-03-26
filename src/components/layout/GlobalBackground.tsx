"use client";

import { motion } from 'framer-motion';

export const GlobalBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-slate-50">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1], 
          x: [0, 50, 0], 
          y: [0, 60, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-primary-blue/15 rounded-full blur-[110px] opacity-60 will-change-transform" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          x: [0, -60, 0], 
          y: [0, -40, 0] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-accent-cyan/15 rounded-full blur-[130px] opacity-60 will-change-transform" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1], 
          x: [0, 30, 0], 
          y: [0, -50, 0] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 left-1/2 w-[30rem] h-[30rem] bg-primary-blue/10 rounded-full blur-[110px] opacity-50 -translate-x-1/2 -translate-y-1/2 will-change-transform" 
      />
    </div>
  );
}
