"use client";

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../animations/variants';
import { Search, PenTool, Rocket } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "We dive deep into your business needs, market positioning, and technical requirements to form a bulletproof strategy.",
    icon: <Search size={24} />
  },
  {
    number: "02",
    title: "Build",
    description: "Our engineering and design teams collaborate to architect, develop, and refine your custom digital system.",
    icon: <PenTool size={24} />
  },
  {
    number: "03",
    title: "Scale",
    description: "We deploy with zero-downtime, optimize performance, and provide iterative support as your user base expands.",
    icon: <Rocket size={24} />
  }
];

export const ProcessSection = () => {
  return (
    <section id="process" className="py-16 md:py-24 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 md:text-center max-w-3xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-sm font-bold tracking-widest text-primary-blue uppercase mb-3">
            Our Methodology
          </motion.h2>
          <motion.h3 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            How We Work
          </motion.h3>
          <motion.p variants={fadeUp} className="text-lg text-slate-600">
            A transparent and proven process designed to de-risk development and deliver extraordinary results.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-primary-blue/10 via-primary-blue/30 to-accent-cyan/10 -z-10" />

          {steps.map((step, idx) => (
            <motion.div key={idx} variants={fadeUp} className="relative group">
              <div className="bg-white w-24 h-24 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-primary-blue mb-8 mx-auto md:mx-0 group-hover:-translate-y-2 transition-transform duration-300 relative">
                <div className="absolute -top-3 -right-3 text-4xl font-black text-slate-100 group-hover:text-primary-blue/10 transition-colors duration-300 pointer-events-none">
                  {step.number}
                </div>
                {step.icon}
              </div>
              
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h4>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
