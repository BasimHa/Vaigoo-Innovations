"use client";

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../animations/variants';
import { Zap, Target, Box, Layers } from 'lucide-react';

const stats = [
  { value: "Fast", label: "Delivery Speed", icon: <Zap size={20} className="text-accent-cyan" />, desc: "Rapid prototyping and agile sprints" },
  { value: "Startup", label: "Focused approach", icon: <Target size={20} className="text-accent-cyan" />, desc: "We understand the urgency of founders" },
  { value: "100%", label: "Scalable Infrastructure", icon: <Layers size={20} className="text-accent-cyan" />, desc: "Built to handle your millionth user" },
  { value: "AI First", label: "Innovation Driven", icon: <Box size={20} className="text-accent-cyan" />, desc: "Leveraging tomorrow's tech today" }
];

export const WhyVaigooSection = () => {
  return (
    <section className="py-24 relative object-contain isolate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-sm font-bold tracking-widest text-primary-blue uppercase mb-3">
              Why Vaigoo
            </motion.h2>
            <motion.h3 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Built for <span className="text-gradient-primary">Speed &amp; Scale</span>
            </motion.h3>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-8 leading-relaxed">
              We operate at the intersection of high-end design, robust software engineering, and artificial intelligence. Our solutions aren't just websites—they are digital business engines. 
            </motion.p>
          </motion.div>

          {/* Metrics Dashboard Layout */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp} 
                className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-blue/5 transition-transform">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {stat.value}
                </div>
                <p className="text-slate-600 text-sm">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
