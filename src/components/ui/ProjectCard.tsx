"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { fadeUp } from '../animations/variants';
import { useState, useEffect } from 'react';

interface ProjectCardProps {
  title: string;
  category?: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  iframeSrc?: string;
}

export const ProjectCard = ({ title, imageSrc, href, iframeSrc }: ProjectCardProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // To handle mobile optional static preview click
  const [isMobileRendered, setIsMobileRendered] = useState(false);
  
  useEffect(() => {
    // Basic check for mobile via window size, you could also use a media query
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobileRendered(true); // Always render iframe now to keep it simple or require click
      } else {
        setIsMobileRendered(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const Component = href ? motion.a : motion.div;

  return (
    <Component 
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      variants={fadeUp}
      className={`group relative rounded-[20px] overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out block aspect-[4/5] sm:aspect-[4/5] lg:aspect-[4/5] bg-slate-900 border border-slate-200/60 isolate`}
    >
      <div className="absolute inset-0 w-full h-full bg-slate-100 overflow-hidden group-hover:scale-105 transition-transform duration-700 ease-out">
        {iframeSrc && !hasError ? (
          <div className="relative w-full h-full">
            {/* Live Preview Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-white text-[10px] sm:text-[11px] font-medium tracking-wide">Live Preview</span>
            </div>

            {/* Shimmer Loader */}
            {!iframeLoaded && (
              <div className="absolute inset-0 z-10 bg-slate-200 animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-300 border-t-primary-blue rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Device Frame Background */}
            <div className="absolute inset-x-2 inset-y-2 bg-white rounded-[16px] shadow-sm overflow-hidden z-0">
               {isMobileRendered && (
                 <div className="w-[118%] h-[118%] transform origin-top-left scale-[0.85] pointer-events-none">
                   <iframe
                     src={iframeSrc}
                     onLoad={() => setIframeLoaded(true)}
                     onError={() => setHasError(true)}
                     loading="lazy"
                     title={`${title} Live Preview`}
                     className="w-full h-full border-none pointer-events-none"
                   />
                 </div>
               )}
            </div>
          </div>
        ) : imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover object-top group-hover:object-bottom transition-all duration-[6000ms] ease-in-out"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-500 font-bold tracking-widest uppercase text-center px-4">{title}</span>
          </div>
        )}
      </div>

      {/* Bottom Overlay Area */}
      <div className="absolute bottom-[10px] left-[10px] right-[10px] z-10 bg-white/90 backdrop-blur-[10px] rounded-xl px-[14px] py-[10px] flex justify-between items-center shadow-md">
        <span className="font-bold text-slate-900 text-sm md:text-base truncate mr-3">{title}</span>
        <button className="bg-black text-white px-[14px] py-[6px] rounded-[20px] text-xs font-semibold whitespace-nowrap hover:bg-slate-800 transition-colors flex items-center gap-1">
          Visit Site <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </Component>
  );
};
