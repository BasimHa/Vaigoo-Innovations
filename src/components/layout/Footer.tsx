"use client";

import { Globe, MessageCircle, Mail, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const Footer = () => {
  const router = useRouter();
  return (
    <footer className="relative border-t border-slate-200/50 pt-12 md:pt-20 pb-10 mt-12 z-10 w-full backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-2">
            <button onClick={() => router.push("/")} className="flex items-center gap-3 mb-6 appearance-none bg-transparent border-none p-0 cursor-pointer text-left w-full">
              <Image 
                src="/android-chrome-512x512.png" 
                alt="Vaigoo Innovations Logo" 
                width={44} 
                height={44}
                className="rounded-xl shadow-md"
              />
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Vaigoo <span className="text-gradient-primary">Innovations</span>
              </span>
            </button>
            <p className="text-slate-600 mb-8 max-w-md leading-relaxed">
              We are a next-generation digital solutions technology company. We specialize in building intelligent systems, AI-driven applications, and scalable platforms that empower modern businesses to reach their highest potential.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => window.open("https://vaigoo-innovations.vercel.app", "_blank")} className="w-10 h-10 rounded-full bg-white/50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-primary-blue transition-all duration-300 hover:scale-110 cursor-pointer">
                <Globe size={20} />
              </button>
              <button onClick={() => window.open("https://wa.me/9037049531", "_blank")} className="w-10 h-10 rounded-full bg-white/50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-primary-blue transition-all duration-300 hover:scale-110 cursor-pointer">
                <MessageCircle size={20} />
              </button>
              <button onClick={() => window.open("https://www.linkedin.com/in/vaigoo-innovations-7646123ba/", "_blank")} className="w-10 h-10 rounded-full bg-white/50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-primary-blue transition-all duration-300 hover:scale-110 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </button>
              <button onClick={() => window.open("https://www.instagram.com/vaigoo.innovations.pvt.ltd/", "_blank")} className="w-10 h-10 rounded-full bg-white/50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-primary-blue transition-all duration-300 hover:scale-110 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </button>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Our Services</h4>
            <ul className="space-y-4 text-slate-600">
              <li><button onClick={() => router.push("/#what-we-build")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary-blue/50" /> AI Systems</button></li>
              <li><button onClick={() => router.push("/#what-we-build")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary-blue/50" /> Smart Websites</button></li>
              <li><button onClick={() => router.push("/#what-we-build")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary-blue/50" /> Scalable E-commerce</button></li>
              <li><button onClick={() => router.push("/#what-we-build")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary-blue/50" /> Growth Systems</button></li>
              <li><button onClick={() => router.push("/#what-we-build")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors flex items-center gap-2"><ArrowRight size={14} className="text-primary-blue/50" /> Custom SaaS Tools</button></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4 text-slate-600">
              <li><button onClick={() => router.push("/about")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors">About Us</button></li>
              <li><button onClick={() => router.push("/process")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors">Our Process</button></li>
              <li><button onClick={() => router.push("/projects")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors">Case Studies</button></li>
              <li><button onClick={() => router.push("/careers")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors">Careers</button></li>
              <li><button onClick={() => router.push("/#contact")} className="appearance-none bg-transparent border-none p-0 text-left w-full cursor-pointer hover:text-primary-blue transition-colors">Contact</button></li>
            </ul>
          </div>
          
          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-5 text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-blue mt-0.5 shrink-0" />
                <span>Anakkaru Veedu Kumily P.O,<br/>Idukki, Kerala 685509</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-blue shrink-0" />
                <span>+91 9037049531</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-blue shrink-0" />
                <button onClick={() => window.location.href="mailto:vaigooinnovations@gmail.com?subject=Client%20Inquiry%20-%20Vaigoo%20Innovations&body=Hello%20Vaigoo%20Team%2C%0A%0AI%20am%20interested%20in%20your%20services.%20Please%20share%20more%20details.%0A%0AName%3A%0ACompany%3A%0ARequirement%3A%0A%0AThank%20you."} className="appearance-none bg-transparent border-none p-0 text-left cursor-pointer hover:text-primary-blue transition-colors">vaigooinnovations@gmail.com</button>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-primary-blue shrink-0" />
                <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-200/60 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p className="mb-4 md:mb-0">© {new Date().getFullYear()} Vaigoo Innovations. All rights reserved.</p>
          <div className="flex space-x-6 font-medium">
            <button onClick={() => router.push("/privacy-policy")} className="appearance-none bg-transparent border-none p-0 cursor-pointer hover:text-primary-blue transition-colors">Privacy Policy</button>
            <button onClick={() => router.push("/terms-of-service")} className="appearance-none bg-transparent border-none p-0 cursor-pointer hover:text-primary-blue transition-colors">Terms of Service</button>
            <button onClick={() => router.push("/cookie-policy")} className="appearance-none bg-transparent border-none p-0 cursor-pointer hover:text-primary-blue transition-colors">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
