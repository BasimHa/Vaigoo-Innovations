"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Database, BrainCircuit, PenTool, TrendingUp, Presentation, CheckCircle2, X, MapPin, Clock, ChevronDown, Briefcase, Star } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/components/animations/variants';
import { CustomSelect, Option } from '@/components/ui/CustomSelect';
import { JobListing, isInternship } from '@/lib/jobs';

// ─── Form Options ──────────────────────────────────────────────────────────────

const focusedAreaOptions: Option[] = [
  { value: "Frontend Engineering", label: "Frontend Engineering", description: "React, Next.js, Framer Motion", icon: <Code size={20} /> },
  { value: "Backend Engineering", label: "Backend Engineering", description: "Node.js, Python, Databases", icon: <Database size={20} /> },
  { value: "AI / Machine Learning", label: "AI / Machine Learning", description: "LLMs, Data Pipelines, AI Agents", icon: <BrainCircuit size={20} /> },
  { value: "UI/UX Design", label: "UI/UX Design", description: "Figma, User Research, Prototyping", icon: <PenTool size={20} /> },
  { value: "Growth & Marketing", label: "Growth & Marketing", description: "SEO, Campaigns, Analytics", icon: <TrendingUp size={20} /> },
  { value: "Other / General", label: "Other / General", description: "Sales, Operations, General", icon: <Presentation size={20} /> },
];

const internshipTypeOptions: Option[] = [
  { value: "Internship 6 Months Paid", label: "6 Months — Paid", description: "Paid internship program.", icon: <Briefcase size={20} /> },
  { value: "Internship 6 Months Free", label: "6 Months — Unpaid", description: "Unpaid / skill training.", icon: <Briefcase size={20} /> },
  { value: "Internship 12 Months Paid", label: "12 Months — Paid", description: "Long-term paid program.", icon: <Briefcase size={20} /> },
  { value: "Internship 12 Months Free", label: "12 Months — Unpaid", description: "Long-term unpaid program.", icon: <Briefcase size={20} /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function EmploymentBadge({ type }: { type: string }) {
  const isInt = isInternship(type as any);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isInt ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
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

// ─── Job Listings ─────────────────────────────────────────────────────────────

function JobListingsDisplay({ jobs, onApply }: { jobs: JobListing[]; onApply: (job: JobListing) => void }) {
  if (jobs.length === 0) return null;

  const featured = jobs.filter((j) => j.featured);
  const regular = jobs.filter((j) => !j.featured);

  const JobCard = ({ job }: { job: JobListing }) => (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
        job.featured
          ? 'bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-sm'
          : 'bg-white/70 backdrop-blur-md border-slate-200/50 shadow-sm'
      }`}
    >
      {job.featured && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star size={13} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Featured Role</span>
        </div>
      )}
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
          {job.salaryStipend && <p className="text-xs text-slate-500 mt-2">💰 {job.salaryStipend}</p>}
        </div>
        <div className="shrink-0">
          <a
            href="#apply-form"
            onClick={(e) => { e.preventDefault(); onApply(job); }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Apply Now <ChevronDown size={14} className="rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="mb-12">
      {featured.length > 0 && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
          <motion.h2 variants={fadeUp} className="text-xl font-bold text-slate-900 mb-4 font-primary">
            ⭐ <span className="text-gradient-primary">Featured</span> Opportunities
          </motion.h2>
          <div className="grid grid-cols-1 gap-4">
            {featured.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </motion.div>
      )}

      {regular.length > 0 && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h2 variants={fadeUp} className="text-xl font-bold text-slate-900 mb-4 font-primary">
            Open <span className="text-gradient-primary">Positions</span>
          </motion.h2>
          <div className="grid grid-cols-1 gap-4">
            {regular.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const CAREER_FORM_URL =
  'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdC2Z5tERW2sYtjzJN4VP-xCss-aWr1WxaLLqv2gvXCiLwH_Q/formResponse';

export default function CareersPage() {
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [openJobs, setOpenJobs] = useState<JobListing[]>([]);
  const [focusedArea, setFocusedArea] = useState('');
  const [internshipType, setInternshipType] = useState('');
  const [result, setResult] = useState('Submit Application');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetch('/api/jobs?status=open')
      .then((res) => res.json())
      .then((data) => { if (data.data) setOpenJobs(data.data); })
      .catch(console.error);
  }, []);

  const handleApply = (job: JobListing) => {
    // 1. Capture exact job data
    setSelectedJobTitle(job.title);

    // 2. Pre-fill categorical fields
    const match = focusedAreaOptions.find((o) => o.value === job.department);
    if (match) setFocusedArea(match.value);
    
    if (isInternship(job.employmentType as any)) {
      const intMatch = internshipTypeOptions.find((o) => job.employmentType.includes(o.value.replace('Internship ', '')));
      if (intMatch) setInternshipType(intMatch.value);
    } else {
      setInternshipType(''); // Clear if it's a regular job
    }

    // 3. Smooth scroll with offset
    setTimeout(() => {
      const el = document.getElementById('apply-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 4. Trigger premium highlight glow
        setIsHighlighting(true);
        setTimeout(() => setIsHighlighting(false), 2000);
      }
    }, 100);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError('');

    const formEl = event.currentTarget;
    const fd = new FormData(formEl);
    const name = (fd.get('name') as string || '').trim();
    const email = (fd.get('email') as string || '').trim();
    const resume = (fd.get('resumeLink') as string || '').trim();

    // ── Validation ──────────────────────────────────────────────
    if (!name || !email || !resume) {
      setValidationError('Please fill in Name, Email, and Resume Link.');
      return;
    }

    if (!focusedArea && !internshipType) {
      setValidationError('Please select at least a Focused Area or an Internship Type.');
      return;
    }

    // ── Dynamic field construction ───────────────────────────────
    // Only include non-empty values — no null/undefined in output
    setResult('Submitting...');

    const body = new URLSearchParams();
    body.append('entry.1658472497', name);
    body.append('entry.862200673', email);

    if (focusedArea) body.append('entry.435392044', focusedArea);
    if (internshipType) body.append('entry.153460694', internshipType);

    // Append job title to the resume/portfolio field for admin context
    const finalResume = selectedJobTitle ? `[JOB: ${selectedJobTitle}] ${resume}` : resume;
    body.append('entry.1608247299', finalResume);

    try {
      await fetch(CAREER_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      setResult('Submit Application');
      setShowSuccessModal(true);
      formEl.reset();
      setFocusedArea('');
      setInternshipType('');
    } catch (err) {
      setResult('Failed. Try again.');
      setTimeout(() => setResult('Submit Application'), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
          Join <span className="text-gradient-primary">Our Team</span>
        </h1>
        <p className="text-xl text-slate-600">Build the next generation of digital platforms with us.</p>
      </div>

      <JobListingsDisplay jobs={openJobs} onApply={handleApply} />

      {/* Apply anchor */}
      <div id="apply-form" />

      <motion.div
        id="apply-form-section"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        whileInView={isHighlighting ? { boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)", scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border transition-all duration-700 ${
          isHighlighting ? 'border-primary-blue shadow-blue-500/10' : 'border-slate-200/50'
        }`}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Apply <span className="text-gradient-primary">Now</span>
        </h2>
        
        {/* Smart UX Indicator */}
        <AnimatePresence>
          {selectedJobTitle && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-8 text-blue-600 font-medium text-sm bg-blue-50/50 w-fit px-3 py-1.5 rounded-lg border border-blue-100"
            >
              <span className="animate-pulse">👉</span> You are applying for: <strong className="text-blue-700 tracking-tight">{selectedJobTitle}</strong>
              <button 
                onClick={() => setSelectedJobTitle('')} 
                className="ml-2 hover:text-blue-900 transition-colors"
                title="Clear selection"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Row 1 — Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400"
                placeholder="Jane Doe"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400"
                placeholder="jane@example.com"
              />
            </motion.div>
          </div>

          {/* Row 2 — Focused Area (optional if internship is filled) */}
          <motion.div variants={fadeUp}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Focused Area{' '}
              <span className="text-slate-400 font-normal text-xs">(optional if applying as Internship)</span>
            </label>
            <CustomSelect
              options={focusedAreaOptions}
              value={focusedArea}
              onChange={setFocusedArea}
              placeholder="Select your area of expertise..."
              name="focusedArea"
              required={false}
            />
          </motion.div>

          {/* Row 3 — Internship Type (optional if focused area is filled) */}
          <motion.div variants={fadeUp}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Internship Type{' '}
              <span className="text-slate-400 font-normal text-xs">(optional if applying for a full-time role)</span>
            </label>
            <CustomSelect
              options={internshipTypeOptions}
              value={internshipType}
              onChange={setInternshipType}
              placeholder="Select internship program type..."
              name="internshipType"
              required={false}
            />
          </motion.div>

          {/* Dynamic summary — only renders when something is selected */}
          <AnimatePresence>
            {(focusedArea || internshipType) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 space-y-1">
                  <p className="font-semibold">Your application will include:</p>
                  {focusedArea && <p>• Focused Area: <strong>{focusedArea}</strong></p>}
                  {internshipType && <p>• Internship: <strong>{internshipType}</strong></p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Row 4 — Resume */}
          <motion.div variants={fadeUp}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Resume / Portfolio Link <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              name="resumeLink"
              required
              className="w-full px-4 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all duration-300 shadow-sm placeholder-slate-400"
              placeholder="https://drive.google.com/..."
            />
            <p className="text-xs text-slate-500 mt-2 ml-1">
              Please provide a public Google Drive or Portfolio URL to your resume.
            </p>
          </motion.div>

          {/* Validation Error */}
          {validationError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-medium text-center"
            >
              {validationError}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="pt-4">
            <button
              type="submit"
              disabled={result === 'Submitting...'}
              className="w-full bg-gradient-primary text-white font-bold py-4 px-8 rounded-xl shadow-sm hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
            >
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
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Application Received!</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Thank you for applying to Vaigoo Innovations. Our team will review your application and contact you shortly.
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
