"use client";

import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '../animations/variants';
import { FeatureCard } from '../ui/FeatureCard';
import { MonitorSmartphone, ShoppingCart, Cpu, TrendingUp, Wrench } from 'lucide-react';

const features = [
  {
    title: "Smart Websites",
    description: "High-performance, beautifully designed web experiences optimized for conversion and user engagement.",
    icon: <MonitorSmartphone size={28} />
  },
  {
    title: "Scalable E-commerce",
    description: "Robust, secure online stores built to handle high traffic and complex product catalogs seamlessly.",
    icon: <ShoppingCart size={28} />
  },
  {
    title: "AI Systems",
    description: "Custom artificial intelligence integrations that automate workflows and unlock powerful new capabilities.",
    icon: <Cpu size={28} />
  },
  {
    title: "Growth Systems",
    description: "Data-driven SEO and marketing technical infrastructures designed to scale your audience.",
    icon: <TrendingUp size={28} />
  },
  {
    title: "Custom Digital Tools",
    description: "Bespoke SaaS applications and internal tools tailored exactly to your unique business needs.",
    icon: <Wrench size={28} />
  }
];

export const WhatWeBuildSection = () => {
  return (
    <section id="what-we-build" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 md:text-center max-w-3xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-sm font-bold tracking-widest text-primary-blue uppercase mb-3">
            Capabilities
          </motion.h2>
          <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            What We Build
          </motion.h3>
          <motion.p variants={fadeUp} className="text-lg text-slate-600">
            We don't just write code. We architect scalable solutions that serve as the foundation for your company's growth.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <div key={idx} className={idx === 3 ? "lg:col-span-1 lg:col-start-2" : idx === 4 ? "lg:col-span-1" : ""}>
               <FeatureCard 
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
