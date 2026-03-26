"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/components/animations/variants';

export default function InternshipPage() {
  const [result, setResult] = useState("Submit Application");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Submitting...");
    
    const formElement = event.currentTarget;
    const nativeData = new FormData(formElement);
    
    const nameVal = nativeData.get("name");
    const emailVal = nativeData.get("email");
    const domainVal = nativeData.get("domain");
    const durationVal = nativeData.get("duration");
    const internshipTypeVal = nativeData.get("internshipType");
    const resumeLinkVal = nativeData.get("resumeLink");

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'internship',
          name: nameVal,
          email: emailVal,
          domain: domainVal,
          duration: durationVal,
          internshipType: internshipTypeVal,
          resume: resumeLinkVal
        })
      });

      if (!response.ok) throw new Error("Submission failed");
      
      setResult("Submit Application");
      setShowSuccessModal(true);
      formElement.reset();
    } catch (err: any) {
      console.error("Network Fetch Error:", err);
      setResult("Failed. Try again.");
      setTimeout(() => setResult("Submit Application"), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
       <div className="text-center mb-16">
         <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">Internship <span className="text-gradient-primary">Openings</span></h1>
         <p className="text-xl text-slate-600">Start your career with hands-on experience at Vaigoo Innovations.</p>
       </div>

       <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50">
         <form className="space-y-6" onSubmit={handleSubmit}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <motion.div variants={fadeUp}>
               <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
               <input type="text" name="name" required className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm text-slate-900" placeholder="John Doe" />
             </motion.div>
             <motion.div variants={fadeUp}>
               <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
               <input type="email" name="email" required className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm text-slate-900" placeholder="john@example.com" />
             </motion.div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <motion.div variants={fadeUp}>
               <label className="block text-sm font-medium text-slate-700 mb-2">Domain / Field</label>
               <input type="text" name="domain" required className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm text-slate-900" placeholder="e.g. Frontend Development" />
             </motion.div>
             <motion.div variants={fadeUp}>
               <label className="block text-sm font-medium text-slate-700 mb-2">Duration Preference</label>
               <select name="duration" required className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm text-slate-900">
                 <option value="6 Months">6 Months</option>
                 <option value="12 Months">12 Months</option>
               </select>
             </motion.div>
           </div>

           <motion.div variants={fadeUp}>
             <label className="block text-sm font-medium text-slate-700 mb-2">Internship Type</label>
             <select name="internshipType" required className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm text-slate-900">
               <option value="Internship 6 Months Paid">Internship 6 Months Paid</option>
               <option value="Internship 6 Months Free">Internship 6 Months Free</option>
               <option value="Internship 12 Months Paid">Internship 12 Months Paid</option>
               <option value="Internship 12 Months Free">Internship 12 Months Free</option>
             </select>
           </motion.div>

           <motion.div variants={fadeUp}>
             <label className="block text-sm font-medium text-slate-700 mb-2">Resume / Portfolio Link</label>
             <input type="url" name="resumeLink" required className="w-full px-4 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm text-slate-900" placeholder="https://drive.google.com/..." />
           </motion.div>

           <motion.div variants={fadeUp} className="pt-4">
             <button type="submit" disabled={result === "Submitting..."} className="w-full bg-gradient-primary text-white font-bold py-4 px-8 rounded-xl shadow-sm hover:shadow-lg hover:shadow-primary-blue/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70">
               {result}
             </button>
           </motion.div>
         </form>
       </motion.div>

       {/* Success Modal */}
       <AnimatePresence>
         {showSuccessModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full text-center z-10">
               <button onClick={() => setShowSuccessModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} className="text-green-500" /></div>
               <h3 className="text-2xl font-bold text-slate-900 mb-3">Application Received!</h3>
               <p className="text-slate-600 mb-8 leading-relaxed">Your internship application has been submitted successfully. We will review it and get back to you soon.</p>
               <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">Close</button>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
}
