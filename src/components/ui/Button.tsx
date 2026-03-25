"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export const Button = ({ variant = 'primary', children, className = '', href, ...props }: ButtonProps) => {
  const baseClasses = "px-6 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:soft-glow hover:-translate-y-1 shadow-md shadow-blue-500/20",
    secondary: "bg-white text-slate-900 shadow-md border border-slate-100 hover:shadow-lg hover:-translate-y-1",
    outline: "border-2 border-primary-blue text-slate-800 hover:bg-primary-blue/5 hover:-translate-y-1"
  };

  const Component = href ? motion.a : motion.button;
  
  return (
    <Component 
      href={href}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileTap={{ scale: 0.97 }}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};
