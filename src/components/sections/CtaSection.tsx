"use client";

import { motion } from 'framer-motion';
import { fadeUp, scaleIn } from '../animations/variants';
import { Button } from '../ui/Button';

export const CtaSection = () => {
  return (
    <section className="py-32 relative overflow-hidden flex justify-center items-center">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            variants={fadeUp} 
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-8"
          >
            Let's build something <span className="text-gradient-primary">powerful</span>.
          </motion.h2>
          
          <motion.p 
            variants={fadeUp} 
            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto"
          >
            Whether you need a scalable web application, an AI integration, or a complete digital overhaul, our team is ready to deliver.
          </motion.p>
          
          <motion.div variants={scaleIn}>
            <Button href="/#contact" variant="primary" className="text-lg px-10 py-5">
              Start Your Project
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
