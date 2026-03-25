"use client";

import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { fadeUp, staggerContainer } from '../animations/variants';

export const HeroSection = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-slate-200 text-slate-800 font-semibold text-sm tracking-wide shadow-sm">
              <span className="text-primary-blue mr-2">✦</span> Vaigoo Innovations
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]"
          >
            We build <span className="text-gradient-primary">intelligent</span> digital systems.
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
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
