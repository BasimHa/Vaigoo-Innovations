"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, CheckCircle2, X } from 'lucide-react';
import { fadeUp, staggerContainer, scaleIn } from '../animations/variants';
import { CountryCodePicker, COUNTRY_CODES } from '../ui/CountryCodePicker';

export const ContactSection = () => {
  const [result, setResult] = useState("Send Message");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending...");
    
    // Store hard reference to prevent React synthetic event pooling wipeout
    const formElement = event.currentTarget;
    
    // Convert to explicit URLSearchParams for Google Forms compatibility
    const nativeData = new FormData(formElement);
    const searchParams = new URLSearchParams();
    
    // Google Form mapping logic
    const nameVal = nativeData.get("name");
    if (nameVal) searchParams.append("entry.1181522634", nameVal as string);
    
    const emailVal = nativeData.get("email");
    if (emailVal) searchParams.append("entry.179018669", emailVal as string);
    
    const messageVal = nativeData.get("message");
    if (messageVal) searchParams.append("entry.523101576", messageVal as string);
    
    // Wire the natively validated Phone Number string directly
    if (phoneNumber) {
      searchParams.append("entry.1731605438", `${selectedCountry.code} ${phoneNumber}`);
    }
    
    try {
      await fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSdCBrMfuGPfUqmaZFwgUnLhpXlba5hhYWyXH0M_anLmQPSXAQ/formResponse", {
        method: "POST",
        body: searchParams,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        mode: "no-cors" // Required to bypass opaque Google CORS
      });
      
      setResult("Send Message");
      setShowSuccessModal(true);
      formElement.reset();
      setPhoneNumber('');
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setResult("Failed. Try again.");
      setTimeout(() => setResult("Send Message"), 4000);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-sm font-bold tracking-widest text-primary-blue uppercase mb-3">
              Get In Touch
            </motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Let's start a <span className="text-gradient-primary">conversation</span>
            </motion.h3>
            <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-12">
              Ready to transform your business with intelligent technology? Fill out the form, and our engineering team will get back to you within 24 hours.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="space-y-6">
              <motion.div variants={fadeUp} className="flex items-center space-x-4 text-slate-700">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-blue hover:bg-primary-blue/5 transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Email us directly</p>
                  <a href="mailto:vaigooinnovations@gmail.com?subject=Client%20Inquiry%20-%20Vaigoo%20Innovations&body=Hello%20Vaigoo%20Team%2C%0A%0AI%20am%20interested%20in%20your%20services.%20Please%20share%20more%20details.%0A%0AName%3A%0ACompany%3A%0ARequirement%3A%0A%0AThank%20you." className="text-primary-blue hover:underline">vaigooinnovations@gmail.com</a>
                </div>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex items-center space-x-4 text-slate-700">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-blue hover:bg-primary-blue/5 transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Contact Number</p>
                  <p className="text-slate-600">+91 90370 49531</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex items-center space-x-4 text-slate-700">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-blue hover:bg-primary-blue/5 transition-colors">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Headquarters</p>
                  <p className="text-slate-600 mt-1 text-sm leading-snug">
                    Anakkaru Veedu Kumily P.O<br/>
                    Idukki, Kerala 685509
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-blue/10 rounded-full blur-3xl -z-10" />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Anti-spam honeypot */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input type="text" name="name" required placeholder="John Doe" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" name="email" required placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <div className="flex">
                    <CountryCodePicker 
                      selected={selectedCountry}
                      onSelect={(c) => {
                        setSelectedCountry(c);
                        setPhoneNumber('');
                      }}
                    />
                    <input 
                      type="tel" 
                      name="phone"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= selectedCountry.maxLength) {
                          setPhoneNumber(val);
                        }
                      }}
                      placeholder={`Max ${selectedCountry.maxLength} digits`}
                      className="w-full px-4 py-3 rounded-r-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors" 
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea rows={5} name="message" required placeholder="Tell us about your next project..." className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors resize-none" />
                </div>
                
                <button type="submit" disabled={result === "Sending..."} className="w-full bg-gradient-primary text-white font-bold py-4 rounded-lg shadow-lg shadow-primary-blue/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0">
                  {result}
                </button>
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowSuccessModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full text-center z-10"
            >
              <button 
                type="button"
                onClick={() => setShowSuccessModal(false)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Received!</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Thank you for reaching out to Vaigoo Innovations. Our engineering team will review your message and get back to you within 24 hours.
              </p>
              <button 
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
