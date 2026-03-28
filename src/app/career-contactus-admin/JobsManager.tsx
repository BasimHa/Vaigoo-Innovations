"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Briefcase, Users, CheckCircle2, XCircle, Search } from 'lucide-react';
import { JobListing, Department, EmploymentType, WorkLocation, DEPARTMENTS, EMPLOYMENT_TYPES, LOCATIONS, isInternship } from '@/lib/jobs';

// ─── Blank form state ─────────────────────────────────────────────────────────
const blankForm = (): Omit<JobListing, 'id' | 'createdAt'> => ({
  title: '', department: 'General', employmentType: 'Full-time', description: '', requirements: '', location: 'Remote', duration: '', salaryStipend: '', status: 'open', featured: false
});

// ─── Sub-components ───────────────────────────────────────────────────────────
function SelectField<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: readonly T[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all text-sm">
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder = '', required = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all text-sm" />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder = '', rows = 4, required = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} rows={rows} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all text-sm resize-none" />
    </div>
  );
}

// ─── Job Form Modal ───────────────────────────────────────────────────────────
function JobFormModal({ initial, onSave, onClose }: { initial?: JobListing; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<JobListing, 'id' | 'createdAt'>>(
    initial ? { title: initial.title, department: initial.department, employmentType: initial.employmentType, description: initial.description, requirements: initial.requirements, location: initial.location, duration: initial.duration ?? '', salaryStipend: initial.salaryStipend ?? '', status: initial.status, featured: initial.featured ?? false } : blankForm()
  );

  const setField = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (form.employmentType.includes('6 Months')) setField('duration', '6 months');
    else if (form.employmentType.includes('12 Months')) setField('duration', '12 months');
  }, [form.employmentType]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-100 rounded-3xl shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-white/95 backdrop-blur-md z-[60] rounded-t-3xl">
          <h2 className="text-lg font-bold text-slate-900">{initial ? 'Edit Job Listing' : 'Create New Job Listing'}</h2>
          <button onClick={onClose} className="relative z-[9999] pointer-events-auto text-slate-500 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <TextField label="Job Title" value={form.title} onChange={(v) => setField('title', v)} placeholder="e.g. Senior Frontend Engineer" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField<Department> label="Department" value={form.department} onChange={(v) => setField('department', v)} options={DEPARTMENTS} />
            <SelectField<EmploymentType> label="Employment Type" value={form.employmentType} onChange={(v) => setField('employmentType', v)} options={EMPLOYMENT_TYPES} />
          </div>
          <TextareaField label="Description" value={form.description} onChange={(v) => setField('description', v)} placeholder="Describe the role..." rows={4} required />
          <TextareaField label="Requirements" value={form.requirements} onChange={(v) => setField('requirements', v)} placeholder="List skills required..." rows={4} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField<WorkLocation> label="Location" value={form.location} onChange={(v) => setField('location', v)} options={LOCATIONS} />
            <TextField label="Duration (optional)" value={form.duration ?? ''} onChange={(v) => setField('duration', v)} placeholder={isInternship(form.employmentType) ? 'e.g. 6 months' : 'N/A'} />
          </div>
          <TextField label="Salary / Stipend (optional)" value={form.salaryStipend ?? ''} onChange={(v) => setField('salaryStipend', v)} placeholder="e.g. ₹15,000/month or Competitive" />
          <div className="flex items-center justify-between bg-amber-50 rounded-xl px-5 py-3.5 border border-amber-200">
            <div>
              <p className="text-sm font-medium text-amber-900">⭐ Feature this Job</p>
              <p className="text-xs text-amber-700">Featured jobs appear at the top of the careers page with a badge</p>
            </div>
            <button type="button" onClick={() => setField('featured', !form.featured)} className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${form.featured ? 'bg-amber-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${form.featured ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-5 py-3.5 border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-800">Publish Listing</p>
              <p className="text-xs text-slate-500">Open listings appear on the public careers page</p>
            </div>
            <button type="button" onClick={() => setField('status', form.status === 'open' ? 'closed' : 'open')} className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${form.status === 'open' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${form.status === 'open' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/20 text-sm">{initial ? 'Save Changes' : 'Create Listing'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main Manager Component ───────────────────────────────────────────────────
export default function JobsManager({ password }: { password: string }) {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | undefined>();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs'); // GET doesn't require pass
      if (res.ok) {
        const { data } = await res.json();
        setJobs(data || []);
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSave = async (data: any) => {
    if (editingJob) {
      await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${password}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingJob.id, ...data })
      });
    } else {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${password}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    setShowModal(false);
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/jobs?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${password}` }});
    setDeleteConfirmId(null);
    fetchJobs();
  };

  const handleToggle = async (job: JobListing) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    await fetch('/api/jobs', {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${password}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: job.id, status: newStatus })
    });
    fetchJobs();
  };

  return (
    <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
           <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Manage Job Listings</h2>
           <p className="text-sm text-slate-500 mt-1">Create and track live careers published to the website.</p>
        </div>
        <button onClick={() => { setEditingJob(undefined); setShowModal(true); }} className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary text-white text-sm font-bold rounded-2xl hover:-translate-y-0.5 transition-all shadow-lg active:scale-95 shrink-0">
          <Plus size={20} /> New Job
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading jobs database...</div>
      ) : jobs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-16 border-2 border-dashed border-slate-100 rounded-3xl">
          <Briefcase size={40} className="text-slate-300 mb-4" />
          <p className="text-slate-700 font-bold">No active listings</p>
          <p className="text-sm mt-1">Click "New Job" to post an opening.</p>
        </div>
      ) : (
        <div className="relative group/jobs">
           <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 lg:hidden opacity-0 group-hover/jobs:opacity-100 transition-opacity" />
           <div className="overflow-x-auto scrollbar-thin">
             <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Job Title</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      {job.featured && <span className="text-amber-500 text-xs font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">⭐ Featured</span>}
                      {job.title}
                    </p>
                    <p className="text-xs text-slate-500">{job.location}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{job.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 text-[11px] font-bold uppercase rounded-md ${isInternship(job.employmentType) ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>{job.employmentType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 text-[11px] font-bold uppercase rounded-md ${job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                       {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleToggle(job)} title={job.status === 'open' ? 'Close listing' : 'Open listing'} className="p-2 rounded-lg text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                        {job.status === 'open' ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => { setEditingJob(job); setShowModal(true); }} title="Edit listing" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                        <Edit2 size={16} />
                      </button>
                      {deleteConfirmId === job.id ? (
                        <div className="flex items-center gap-1 ml-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                          <button onClick={() => handleDelete(job.id)} className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 transition-colors">Yes</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded hover:bg-slate-100 transition-colors">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(job.id)} title="Delete listing" className="p-2 rounded-lg text-slate-400 hover:text-red-500 border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

      <AnimatePresence>
        {showModal && <JobFormModal initial={editingJob} onSave={handleSave} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
