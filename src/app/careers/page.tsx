"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Code, Database, BrainCircuit, PenTool, TrendingUp, Presentation, CheckCircle2, X } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/components/animations/variants';
import { CustomSelect, Option } from '@/components/ui/CustomSelect';

const departmentOptions: Option[] = [
  { value: "Frontend engineering", label: "Frontend Engineering", description: "React, Next.js, Framer Motion", icon: <Code size={20} /> },
  { value: "Backend Engineering", label: "Backend Engineering", description: "Node.js, Python, Databases", icon: <Database size={20} /> },
  { value: "Ai/ML", label: "AI / Machine Learning", description: "LLMs, Data Pipelines, AI Agents", icon: <BrainCircuit size={20} /> },
  { value: "UI/UX designing", label: "UI/UX Design", description: "Figma, User Research, Prototyping", icon: <PenTool size={20} /> },
  { value: "Growth and Marketing", label: "Growth & Marketing", description: "SEO, Campaigns, Analytics", icon: <TrendingUp size={20} /> },
  { value: "__other_option__", label: "Other / General", description: "Sales, Operations, General", icon: <Presentation size={20} /> },
];

export default function CareersPage() {
  const [focusedArea, setFocusedArea] = useState<string>('');
  const [otherRole, setOtherRole] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState("Submit Application");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Submitting...");
    
    // Store hard reference to the form so React's garbage collector doesn't wipe currentTarget during the await!
    const formElement = event.currentTarget;
    
    // Map native elements safely via URLSearchParams to explicitly send standard web form encodings to Google
    const nativeData = new FormData(formElement);
    const searchParams = new URLSearchParams();
    
    // Convert to Google Form entry IDs safely
    const nameVal = nativeData.get("name");
    if (nameVal) searchParams.append("entry.1282054239", nameVal as string);
    
    const emailVal = nativeData.get("email");
    if (emailVal) searchParams.append("entry.965589471", emailVal as string);
    if (focusedArea) {
      searchParams.append("entry.758056272", focusedArea);
      if (focusedArea === "__other_option__") {
        searchParams.append("entry.758056272.other_option_response", otherRole || "Not specified");
      }
    }
    // Resume Link Extraction mapped strictly to the new Short Answer Google Form field
    const resumeLinkVal = nativeData.get("resumeLink");
    if (resumeLinkVal) {
      searchParams.append("entry.46420921", resumeLinkVal as string);
    }
    
    try {
      // mode: 'no-cors' sends data opaquely, completely ignoring CORS headers
      await fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSdyobGAMFFyyxjQ3oPkc20FiU7dHWLU5W7fHLfd3fbb9Zmprg/formResponse", {
        method: "POST",
        body: searchParams,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        mode: "no-cors"
      });
      
      // Opaque response means the browser sent the POST regardless of cors
      setResult("Submit Application");
      setShowSuccessModal(true);
      formElement.reset();  // Uses hard reference!
      setFocusedArea('');
      setOtherRole('');
      setFileName(null);
      
    } catch (err: any) {
      console.error("Network Fetch Error:", err);
      setResult(`Error: ${err.message || 'Network issue'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
       <div className="text-center mb-16">
         <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">Join <span className="text-gradient-primary">Our Team</span></h1>
         <p className="text-xl text-slate-600">Build the next generation of digital platforms with us.</p>
       </div>

       <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50">
         <form className="space-y-6" onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
           <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <motion.div variants={fadeUp}>
               <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
               <input type="text" name="name" required className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400" placeholder="Jane Doe" />
             </motion.div>
             <motion.div variants={fadeUp}>
               <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
               <input type="email" name="email" required className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400" placeholder="jane@example.com" />
             </motion.div>
           </div>
           
           <motion.div variants={fadeUp}>
             <label className="block text-sm font-medium text-slate-700 mb-2">Focused Area (Department)</label>
             <CustomSelect 
               options={departmentOptions}
               value={focusedArea}
               onChange={setFocusedArea}
               placeholder="Select your area of expertise"
             />
           </motion.div>

           <AnimatePresence>
             {focusedArea === "__other_option__" && (
               <motion.div
                 initial={{ opacity: 0, height: 0, marginTop: 0 }}
                 animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                 exit={{ opacity: 0, height: 0, marginTop: 0 }}
                 className="overflow-hidden"
               >
                 <div className="space-y-4 px-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Please specify your role/field</label>
                   <textarea
                     name="otherRole"
                     value={otherRole}
                     onChange={(e) => setOtherRole(e.target.value)}
                     required
                     rows={3}
                     className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400 resize-none"
                     placeholder="Tell us what you do..."
                   />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           <motion.div variants={fadeUp}>
             <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio / Resume Link</label>
             <input 
               type="url" 
               name="resumeLink" 
               required 
               className="w-full px-4 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400" 
               placeholder="https://drive.google.com/..." 
             />
             <p className="text-xs text-slate-500 mt-2 ml-1">Please provide a public Google Drive or Website URL to your resume.</p>
           </motion.div>

           <motion.div variants={fadeUp} className="pt-4">
             <button type="submit" disabled={result === "Submitting..."} className="w-full bg-gradient-primary text-white font-bold py-4 px-8 rounded-xl shadow-sm hover:shadow-lg hover:shadow-primary-blue/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0">
               {result}
             </button>
           </motion.div>
         </form>
       </motion.div>

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
               <button onClick={() => setShowSuccessModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                 <X size={24} />
               </button>
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 size={40} className="text-green-500" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-3">Application Received!</h3>
               <p className="text-slate-600 mb-8 leading-relaxed">
                 Thank you for applying to Vaigoo Innovations. Our team will review your application and get back to you shortly.
               </p>
               <button 
                 onClick={() => setShowSuccessModal(false)}
                 className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
               >
                 Back to Careers
               </button>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
}
