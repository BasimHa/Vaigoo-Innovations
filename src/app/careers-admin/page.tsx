"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Lock,
  Briefcase, Users, CheckCircle2, XCircle, Eye, EyeOff,
  ChevronDown, AlertTriangle, LogOut, Shield
} from 'lucide-react';
import {
  getJobs, addJob, updateJob, deleteJob, toggleJobStatus
} from '@/lib/jobsStore';
import {
  JobListing, JobStatus, EmploymentType, Department, WorkLocation,
  EMPLOYMENT_TYPES, DEPARTMENTS, LOCATIONS, isInternship
} from '@/lib/jobs';

// ─── Constants ────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'vaigoo2025';
const SESSION_KEY = 'vaigoo_admin_unlocked';

// ─── Blank form state ─────────────────────────────────────────────────────────

const blankForm = (): Omit<JobListing, 'id' | 'createdAt'> => ({
  title: '',
  department: 'General',
  employmentType: 'Full-time',
  description: '',
  requirements: '',
  location: 'Remote',
  duration: '',
  salaryStipend: '',
  status: 'open',
});

// ─── Badge helpers ────────────────────────────────────────────────────────────

function statusBadge(status: JobStatus) {
  return status === 'open' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      <CheckCircle2 size={11} /> Open
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
      <XCircle size={11} /> Closed
    </span>
  );
}

function typeBadge(type: EmploymentType) {
  const isInt = isInternship(type);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
      isInt ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
    }`}>
      {type}
    </span>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SelectField<T extends string>({
  label, value, onChange, options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none px-4 py-2.5 rounded-xl bg-slate-700/60 border border-slate-600/60 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pr-10 text-sm"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function TextField({
  label, value, onChange, placeholder = '', required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-slate-700/60 border border-slate-600/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
      />
    </div>
  );
}

function TextareaField({
  label, value, onChange, placeholder = '', rows = 4, required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-2.5 rounded-xl bg-slate-700/60 border border-slate-600/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm resize-none"
      />
    </div>
  );
}

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setError('Incorrect password. Please try again.');
      setShaking(true);
      setInput('');
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { opacity: 1, y: 0 }}
        transition={shaking ? { duration: 0.5 } : { duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30">
            <Shield size={28} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
          <p className="text-slate-400 text-sm mb-8">Vaigoo Innovations Career Management</p>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                autoFocus
                className="w-full px-5 py-3.5 pr-12 rounded-xl bg-slate-800/80 border border-slate-600/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertTriangle size={14} /> {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Unlock Dashboard
            </button>
          </form>

          <p className="text-slate-600 text-xs mt-6">
            This page is not publicly linked. Authorised personnel only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Job Form Modal ───────────────────────────────────────────────────────────

function JobFormModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: JobListing;
  onSave: (data: Omit<JobListing, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<JobListing, 'id' | 'createdAt'>>(
    initial
      ? {
          title: initial.title,
          department: initial.department,
          employmentType: initial.employmentType,
          description: initial.description,
          requirements: initial.requirements,
          location: initial.location,
          duration: initial.duration ?? '',
          salaryStipend: initial.salaryStipend ?? '',
          status: initial.status,
        }
      : blankForm()
  );

  const setField = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Auto-suggest duration when employment type changes to an internship
  useEffect(() => {
    if (form.employmentType.includes('6 Months')) {
      setField('duration', '6 months');
    } else if (form.employmentType.includes('12 Months')) {
      setField('duration', '12 months');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.employmentType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md z-10 rounded-t-3xl">
          <h2 className="text-lg font-bold text-white">
            {initial ? 'Edit Job Listing' : 'Create New Job Listing'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Title */}
          <TextField
            label="Job Title"
            value={form.title}
            onChange={(v) => setField('title', v)}
            placeholder="e.g. Senior Frontend Engineer"
            required
          />

          {/* Department + Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField<Department>
              label="Department"
              value={form.department}
              onChange={(v) => setField('department', v)}
              options={DEPARTMENTS}
            />
            <SelectField<EmploymentType>
              label="Employment Type"
              value={form.employmentType}
              onChange={(v) => setField('employmentType', v)}
              options={EMPLOYMENT_TYPES}
            />
          </div>

          {/* Description */}
          <TextareaField
            label="Description"
            value={form.description}
            onChange={(v) => setField('description', v)}
            placeholder="Describe the role, responsibilities, and what success looks like..."
            rows={4}
            required
          />

          {/* Requirements */}
          <TextareaField
            label="Requirements"
            value={form.requirements}
            onChange={(v) => setField('requirements', v)}
            placeholder="List skills, qualifications, and experience required (one per line or comma-separated)..."
            rows={4}
            required
          />

          {/* Location + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField<WorkLocation>
              label="Location"
              value={form.location}
              onChange={(v) => setField('location', v)}
              options={LOCATIONS}
            />
            <TextField
              label="Duration (optional)"
              value={form.duration ?? ''}
              onChange={(v) => setField('duration', v)}
              placeholder={isInternship(form.employmentType) ? 'e.g. 6 months' : 'N/A'}
            />
          </div>

          {/* Salary / Stipend */}
          <TextField
            label="Salary / Stipend (optional)"
            value={form.salaryStipend ?? ''}
            onChange={(v) => setField('salaryStipend', v)}
            placeholder="e.g. ₹15,000/month or Competitive"
          />

          {/* Status toggle */}
          <div className="flex items-center justify-between bg-slate-800/60 rounded-xl px-5 py-3.5 border border-slate-700/40">
            <div>
              <p className="text-sm font-medium text-slate-200">Publish Listing</p>
              <p className="text-xs text-slate-500">Open listings appear on the public careers page</p>
            </div>
            <button
              type="button"
              onClick={() => setField('status', form.status === 'open' ? 'closed' : 'open')}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                form.status === 'open' ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  form.status === 'open' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 text-sm"
            >
              {initial ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function CareersAdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | undefined>();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true);
    }
  }, []);

  // Load jobs when unlocked
  useEffect(() => {
    if (unlocked) setJobs(getJobs());
  }, [unlocked]);

  const refresh = useCallback(() => setJobs(getJobs()), []);

  const handleSave = (data: Omit<JobListing, 'id' | 'createdAt'>) => {
    if (editingJob) {
      updateJob(editingJob.id, data);
    } else {
      addJob(data);
    }
    setShowModal(false);
    setEditingJob(undefined);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteJob(id);
    setDeleteConfirmId(null);
    refresh();
  };

  const handleToggle = (id: string) => {
    toggleJobStatus(id);
    refresh();
  };

  const openCreate = () => { setEditingJob(undefined); setShowModal(true); };
  const openEdit = (job: JobListing) => { setEditingJob(job); setShowModal(true); };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  // ── Password gate ─────────────────────────────────────────────────────────
  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total = jobs.length;
  const open = jobs.filter((j) => j.status === 'open').length;
  const closed = jobs.filter((j) => j.status === 'closed').length;
  const internships = jobs.filter((j) => isInternship(j.employmentType)).length;

  const stats = [
    { icon: Briefcase, label: 'Total Listings', value: total, color: 'text-blue-400' },
    { icon: CheckCircle2, label: 'Open', value: open, color: 'text-emerald-400' },
    { icon: XCircle, label: 'Closed', value: closed, color: 'text-slate-400' },
    { icon: Users, label: 'Internships', value: internships, color: 'text-violet-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow shadow-blue-600/30">
                <Shield size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Admin Panel</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Career Management</h1>
            <p className="text-slate-400 text-sm mt-1">Vaigoo Innovations · Hidden internal dashboard</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
            >
              <Plus size={17} /> New Listing
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 hover:text-white transition-all"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-slate-900/60 backdrop-blur border border-slate-800/60 rounded-2xl p-5">
              <Icon size={22} className={`${color} mb-3`} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-slate-400 text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Job Table */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-800/60 rounded-3xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-white">All Listings</h2>
            <span className="text-xs text-slate-500">{total} total</span>
          </div>

          {jobs.length === 0 ? (
            <div className="py-20 text-center">
              <Briefcase size={40} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No job listings yet</p>
              <p className="text-slate-600 text-sm mt-1">Click <strong className="text-slate-400">New Listing</strong> to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {['Title', 'Department', 'Type', 'Location', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <AnimatePresence>
                    {jobs.map((job) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-white max-w-[180px]">
                          <span className="line-clamp-1">{job.title}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          <span className="line-clamp-1">{job.department}</span>
                        </td>
                        <td className="px-6 py-4">
                          {typeBadge(job.employmentType)}
                        </td>
                        <td className="px-6 py-4 text-slate-400">{job.location}</td>
                        <td className="px-6 py-4">{statusBadge(job.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {/* Toggle */}
                            <button
                              onClick={() => handleToggle(job.id)}
                              title={job.status === 'open' ? 'Close listing' : 'Open listing'}
                              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                            >
                              {job.status === 'open'
                                ? <ToggleRight size={18} className="text-emerald-400" />
                                : <ToggleLeft size={18} />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => openEdit(job)}
                              title="Edit listing"
                              className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all"
                            >
                              <Edit2 size={16} />
                            </button>

                            {/* Delete */}
                            {deleteConfirmId === job.id ? (
                              <div className="flex items-center gap-1 ml-1">
                                <button
                                  onClick={() => handleDelete(job.id)}
                                  className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/40 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(job.id)}
                                title="Delete listing"
                                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-700 text-xs mt-8">
          Vaigoo Innovations · Internal admin panel · Not publicly linked
        </p>
      </div>

      {/* Job form modal */}
      <AnimatePresence>
        {showModal && (
          <JobFormModal
            initial={editingJob}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditingJob(undefined); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
