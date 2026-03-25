"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const CustomSelect = ({ options, value, onChange, placeholder = "Select an option" }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden input to ensure it works with native HTML form submission if needed */}
      <input type="hidden" name="focusedArea" value={value} required />
      
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border transition-all duration-300 shadow-sm flex items-center justify-between focus:outline-none ${isOpen ? 'border-primary-blue ring-2 ring-primary-blue/20' : 'border-slate-200/80 hover:border-slate-300'}`}
      >
        <div className="flex items-center gap-3">
          {selectedOption && (
            <div className="w-6 h-6 rounded-full bg-primary-blue/10 text-primary-blue flex items-center justify-center shrink-0">
               {/* Show tiny icon if selected */}
               <div className="scale-75">{selectedOption.icon}</div>
            </div>
          )}
          <span className={`font-medium truncate ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-400">
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="max-h-80 overflow-y-auto py-2">
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <div 
                    key={option.value}
                    onClick={() => { onChange(option.value); setIsOpen(false); }}
                    className="px-3 py-1 cursor-pointer"
                  >
                     <div className={`px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${isSelected ? 'bg-primary-blue/5' : 'hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                          {option.icon && (
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                               {option.icon}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className={`font-medium ${isSelected ? 'text-primary-blue' : 'text-slate-700'}`}>
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="text-xs text-slate-500 mt-0.5">{option.description}</span>
                            )}
                          </div>
                        </div>
                        {isSelected && <Check size={18} className="text-primary-blue" />}
                     </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
