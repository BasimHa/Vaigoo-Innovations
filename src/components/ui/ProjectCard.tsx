"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { fadeUp } from '../animations/variants';

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  imageSrc?: string;
  href?: string;
}

export const ProjectCard = ({ title, category, description, imageSrc, href }: ProjectCardProps) => {
  const Component = href ? motion.a : motion.div;

  return (
    <Component 
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      variants={fadeUp}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 block aspect-[4/5] bg-slate-200 border border-slate-200/60 isolate`}
    >
      <div className="absolute inset-0 w-full h-full">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover object-top group-hover:object-bottom transition-all duration-[6000ms] ease-in-out"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out">
            <span className="text-slate-500 font-bold tracking-widest uppercase text-center px-4">{title}</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-full px-6 py-3 flex items-center justify-between shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
          <span className="font-bold text-slate-900 text-sm md:text-base truncate mr-2">{title}</span>
          <span className="font-semibold text-slate-800 text-sm flex items-center gap-1 hover:text-primary-blue transition-colors whitespace-nowrap">
            Visit Site
          </span>
        </div>
      </div>
    </Component>
  );
};
