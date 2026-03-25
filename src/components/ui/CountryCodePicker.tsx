"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

export interface Country {
  name: string;
  code: string;
  maxLength: number;
  iso: string;
}

export const COUNTRY_CODES: Country[] = [
  { name: 'India', code: '+91', maxLength: 10, iso: 'in' },
  { name: 'USA & Canada', code: '+1', maxLength: 10, iso: 'us' },
  { name: 'UK', code: '+44', maxLength: 10, iso: 'gb' },
  { name: 'UAE', code: '+971', maxLength: 9, iso: 'ae' },
  { name: 'Saudi Arabia', code: '+966', maxLength: 9, iso: 'sa' },
  { name: 'Australia', code: '+61', maxLength: 9, iso: 'au' },
  { name: 'Germany', code: '+49', maxLength: 11, iso: 'de' },
  { name: 'France', code: '+33', maxLength: 9, iso: 'fr' },
  { name: 'Italy', code: '+39', maxLength: 10, iso: 'it' },
  { name: 'China', code: '+86', maxLength: 11, iso: 'cn' },
  { name: 'Japan', code: '+81', maxLength: 10, iso: 'jp' },
  { name: 'South Korea', code: '+82', maxLength: 10, iso: 'kr' },
  { name: 'Singapore', code: '+65', maxLength: 8, iso: 'sg' },
  { name: 'Malaysia', code: '+60', maxLength: 10, iso: 'my' },
  { name: 'Indonesia', code: '+62', maxLength: 11, iso: 'id' },
  { name: 'Pakistan', code: '+92', maxLength: 10, iso: 'pk' },
  { name: 'Bangladesh', code: '+880', maxLength: 10, iso: 'bd' },
  { name: 'Sri Lanka', code: '+94', maxLength: 9, iso: 'lk' },
  { name: 'Nepal', code: '+977', maxLength: 10, iso: 'np' },
  { name: 'South Africa', code: '+27', maxLength: 9, iso: 'za' },
  { name: 'Nigeria', code: '+234', maxLength: 10, iso: 'ng' },
  { name: 'Brazil', code: '+55', maxLength: 11, iso: 'br' },
  { name: 'Mexico', code: '+52', maxLength: 10, iso: 'mx' },
  { name: 'Russia', code: '+7', maxLength: 10, iso: 'ru' },
  { name: 'Turkey', code: '+90', maxLength: 10, iso: 'tr' },
  { name: 'Spain', code: '+34', maxLength: 9, iso: 'es' },
  { name: 'Netherlands', code: '+31', maxLength: 9, iso: 'nl' },
  { name: 'Sweden', code: '+46', maxLength: 9, iso: 'se' },
  { name: 'Norway', code: '+47', maxLength: 8, iso: 'no' },
  { name: 'Denmark', code: '+45', maxLength: 8, iso: 'dk' },
  { name: 'Finland', code: '+358', maxLength: 10, iso: 'fi' },
  { name: 'New Zealand', code: '+64', maxLength: 9, iso: 'nz' }
];

interface Props {
  selected: Country;
  onSelect: (c: Country) => void;
}

export function CountryCodePicker({ selected, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredData = COUNTRY_CODES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-full px-4 flex w-[140px] items-center justify-between gap-2 bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
      >
        <div className="flex items-center gap-2">
          <img src={`https://flagcdn.com/w20/${selected.iso}.png`} loading="lazy" width="20" alt={`${selected.name} flag`} className="rounded-[2px] shadow-sm shadow-slate-300" />
          <span className="text-slate-700 font-medium text-sm">{selected.code}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-100 origin-top-left"
          >
            <div className="p-3 border-b border-slate-100 relative bg-slate-50">
              <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search countries..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 transition-shadow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredData.length > 0 ? (
                filteredData.map(country => (
                  <button
                    key={country.code + country.name}
                    type="button"
                    onClick={() => {
                      onSelect(country);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-5 py-3 hover:bg-primary-blue/5 border-b border-slate-50 last:border-0 transition-colors flex items-center gap-4 ${selected.iso === country.iso ? 'bg-primary-blue/5' : ''}`}
                  >
                    <img src={`https://flagcdn.com/w40/${country.iso}.png`} loading="lazy" width="28" className="rounded-sm shadow-sm" alt={`${country.name} flag`} />
                    <div className="flex flex-col">
                      <span className={`text-sm tracking-tight ${selected.iso === country.iso ? 'font-bold text-primary-blue' : 'text-slate-700'}`}>{country.name}</span>
                      <span className="text-xs text-slate-400 font-medium">{country.code} • Max {country.maxLength} digits</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">No countries found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
