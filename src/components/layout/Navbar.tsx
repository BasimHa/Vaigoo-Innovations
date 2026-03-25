"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Process', href: '/process' },
  { name: 'Case Studies', href: '/projects' },
  { name: 'Careers', href: '/careers' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Image 
                src="/Images/logo/logo-v.png" 
                alt="Vaigoo Innovations Logo" 
                width={40} 
                height={40}
                className="rounded-lg shadow-sm"
              />
              <span className="text-2xl font-bold tracking-tight text-slate-900 hidden sm:block">
                Vaigoo <span className="text-gradient-primary">Innovations</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, idx) => (
              <motion.div key={link.name} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-blue ${
                    pathname === link.href ? 'text-primary-blue' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
              <Button href={pathname === '/' ? '#contact' : '/#contact'} variant="primary">Start a Project</Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-6 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-medium block ${
                    pathname === link.href ? 'text-primary-blue' : 'text-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2">
                <Button href={pathname === '/' ? '#contact' : '/#contact'} variant="primary" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Start a Project</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
