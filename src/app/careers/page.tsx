"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Code, Database, BrainCircuit, PenTool, TrendingUp, Presentation, CheckCircle2, X, MapPin, Clock, ChevronDown, Briefcase } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/components/animations/variants';
import { CustomSelect, Option } from '@/components/ui/CustomSelect';
import { JobListing, isInternship } from '@/lib/jobs';

const departmentOptions: Option[] = [
  { value: "Frontend", label: "Frontend Engineering", description: "React, Next.js, Framer Motion", icon: <Code size={20} /> },
  { value: "Backend", label: "Backend Engineering", description: "Node.js, Python, Databases", icon: <Database size={20} /> },
  { value: "AI/ML", label: "AI / Machine Learning", description: "LLMs, Data Pipelines, AI Agents", icon: <BrainCircuit size={20} /> },
  { value: "UI/UX", label: "UI/UX Design", description: "Figma, User Research, Prototyping", icon: <PenTool size={20} /> },
  { value: "Growth and Marketing", label: "Growth & Marketing", description: "SEO, Campaigns, Analytics", icon: <TrendingUp size={20} /> },
  { value: "__other_option__", label: "Other / General", description: "Sales, Operations, General", icon: <Presentation size={20} /> },
];

const internshipOptions: Option[] = [
  { value: "Internship 6 Months Paid", label: "Internship 6 Months Paid", description: "Paid program for 6 months.", icon: <Briefcase size={20} /> },
  { value: "Internship 6 Months Free", label: "Internship 6 Months Free", description: "Unpaid / skill training for 6 months.", icon: <Briefcase size={20} /> },
  { value: "Internship 12 Months Paid", label: "Internship 12 Months Paid", description: "Long-term paid program.", icon: <Briefcase size={20} /> },
  { value: "Internship 12 Months Free", label: "Internship 12 Months Free", description: "Long-term unpaid program.", icon: <Briefcase size={20} /> },
];

// ─── Job listing badge helpers ───────────────────────────────────────────────

function EmploymentBadge({ type }: { type: string }) {
  const isInt = isInternship(type as import('@/lib/jobs').EmploymentType);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      isInt ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
    }`}>
      {type}
    </span>
  );
}

function DeptBadge({ dept }: { dept: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
      {dept}
    </span>
  );
}

// ─── Public job listings display (read-only) ──────────────────────────────────

function JobListingsDisplay({ jobs, onApply }: { jobs: JobListing[], onApply: (job: JobListing) => void }) {
  return (
    <div className="mb-12">
      <AnimatePresence mode="wait">
        {jobs.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-10 text-center"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/50 shadow-sm text-slate-500 text-sm">
              <Briefcase size={16} className="text-slate-400" />
              No open positions right now — check back soon!
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible" 
            exit="hidden"
          >
            <motion.h2 variants={fadeUp} className="text-2xl font-bold text-slate-900 mb-6 font-primary">
              Open <span className="text-gradient-primary">Positions</span>
            </motion.h2>
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={fadeUp}
                  className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <DeptBadge dept={job.department} />
                        <EmploymentBadge type={job.employmentType} />
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} /> {job.location}
                        </span>
                        {job.duration && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} /> {job.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{job.description}</p>
                      {job.salaryStipend && (
                        <p className="text-xs text-slate-500 mt-2">💰 {job.salaryStipend}</p>
                      )}
                    </div>
                    <div className="shrink-0">
                      <a
                        href="#apply"
                        onClick={(e) => {
                          e.preventDefault();
                          onApply(job);
                        }}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Apply Now <ChevronDown size={14} className="rotate-[-90deg]" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CareersPage() {
  const [openJobs, setOpenJobs] = useState<JobListing[]>([]);
  const [focusedArea, setFocusedArea] = useState<string>('');
  const [internshipType, setInternshipType] = useState<string>('');
  const [otherRole, setOtherRole] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState("Submit Application");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch open jobs from global Supabase ATS
  useEffect(() => {
    fetch('/api/jobs?status=open')
      .then(res => res.json())
      .then(data => {
        if (data.data) setOpenJobs(data.data);
      })
      .catch(err => console.error("Failed to load jobs", err));
  }, []);

  const handleApply = (job: JobListing) => {
    const role = job.department;
    const exactMatch = departmentOptions.find(d => d.value === role || d.label === role);
    
    if (exactMatch && exactMatch.value !== '__other_option__') {
      setFocusedArea(exactMatch.value);
    } else {
      setFocusedArea('__other_option__');
      setOtherRole(role);
    }
    
    setTimeout(() => {
      document.getElementById('apply-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Submitting...");
    
    // Store hard reference to the form so React's garbage collector doesn't wipe currentTarget during the await!
    const formElement = event.currentTarget;
    const nativeData = new FormData(formElement);
    
    // Convert to unified API format
    const nameVal = nativeData.get("name");
    const emailVal = nativeData.get("email");
    const phoneVal = nativeData.get("phone");
    const messageVal = nativeData.get("message");
    const resumeLinkVal = nativeData.get("resumeLink");
    const focusedAreaVal = nativeData.get("focusedArea");
    const internshipTypeVal = nativeData.get("internshipType"); // New field

    if (!focusedAreaVal && !internshipTypeVal) {
      alert("Please select either a Focused Area or an Internship Type.");
      setResult("Submit Application");
      return;
    }

    try {
      // Send to Unified Submission API (Handles Google Sheets & Email Automation)
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'career',
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          message: messageVal,
          position: focusedArea === '__other_option__' ? otherRole : focusedArea,
          employmentType: 'Full-time', // For careers page
          internshipType: internshipTypeVal || '',
          resume: resumeLinkVal
        })
      });

      if (!response.ok) throw new Error("Submission failed");
      
      setResult("Submit Application");
      setShowSuccessModal(true);
      formElement.reset();  
      setFocusedArea('');
      setInternshipType('');
      setOtherRole('');
      setFileName(null);
      
    } catch (err: any) {
      console.error("Network Fetch Error:", err);
      setResult("Failed. Try again.");
      setTimeout(() => setResult("Submit Application"), 4000);
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
       <div className="text-center mb-16">
         <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">Join <span className="text-gradient-primary">Our Team</span></h1>
         <p className="text-xl text-slate-600">Build the next generation of digital platforms with us.</p>
       </div>

       {/* ── Dynamic job listings (read-only, fed by admin panel) ── */}
       <JobListingsDisplay jobs={openJobs} onApply={handleApply} />

       {/* ── Apply anchor ── */}
       <div id="apply" />

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

           <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
             <motion.div variants={fadeUp}>
               <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
               <input type="tel" name="phone" required className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400" placeholder="+91 90000 00000" />
             </motion.div>
           </div>
           
           <motion.div variants={fadeUp}>
             <label className="block text-sm font-medium text-slate-700 mb-2">Focused Area (Department)</label>
             <CustomSelect 
               options={departmentOptions}
               value={focusedArea}
               onChange={setFocusedArea}
               placeholder="Select Area (Optional if applying for Internship)"
               name="focusedArea"
               required={false}
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Internship Type (If applying for Internship)</label>
              <CustomSelect 
                options={internshipOptions}
                value={internshipType}
                onChange={setInternshipType}
                placeholder="Select Internship Type (Optional if applying for Career)"
                name="internshipType"
                required={false}
              />
            </motion.div>

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

           <motion.div variants={fadeUp}>
             <label className="block text-sm font-medium text-slate-700 mb-2">Message / Cover Letter</label>
             <textarea 
               name="message" 
               required 
               rows={4}
               className="w-full px-4 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400 resize-none" 
               placeholder="Why are you a good fit for this role?" 
             />
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
