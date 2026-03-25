"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeUp } from '../animations/variants';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <motion.div 
      variants={fadeUp}
      className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover-lift relative overflow-hidden group"
    >
      {/* Background soft glow on hover */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl pointer-events-none" />
      
      <div className="w-14 h-14 rounded-xl bg-primary-blue/10 flex items-center justify-center text-primary-blue mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
