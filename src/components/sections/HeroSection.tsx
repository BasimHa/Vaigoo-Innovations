"use client";

import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { fadeUp, staggerContainer } from '../animations/variants';

export const HeroSection = () => {
  return (
    <section id="home" className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >

          
          <motion.h1 
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-6 md:mb-8 leading-[1.1]"
          >
            We build <span className="text-gradient-primary">intelligent</span> digital systems.
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-base sm:text-lg md:text-2xl text-slate-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
          >
            AI-powered solutions, scalable infrastructure, and future-ready products for modern businesses.
          </motion.p>
          
          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="#contact" variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
              Start a Project
            </Button>
            <Button href="#projects" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
              View Case Studies
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
