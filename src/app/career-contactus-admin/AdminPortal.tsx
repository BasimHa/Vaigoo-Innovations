"use client";

import { useState, useEffect } from 'react';
import JobsManager from './JobsManager';
import { Search, RefreshCw, Mail, Briefcase, GraduationCap, CheckCircle, Clock, XCircle, Lock, Eye, Download, Settings, Calendar, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Submission = {
  id: string;
  type: "contact" | "career" | "internship";
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  position: string | null;
  domain: string | null; // Added
  employmentType: string | null;
  duration: string | null;
  internshipType: string | null; // Added
  paidType: string | null;
  resume: string | null;
  status: "new" | "reviewed" | "shortlisted" | "rejected"; // Updated
  interviewDate: string | null; // Added
  meetLink: string | null; // Added
  createdAt: string;
};

export default function AdminPortal() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'contact' | 'career' | 'internship' | 'jobs'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const fetchSubmissions = async (pw: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`/api/submissions?type=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${pw}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.data || []);
        setIsAuthenticated(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setAuthError('Invalid Passkey');
        } else {
          setAuthError(`Database Error: ${errData.error || 'Check Supabase Keys & Schema'}`);
        }
        setIsAuthenticated(false);
      }
    } catch (e) {
      setAuthError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubmissions(password);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
         setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
         if (selectedSub?.id === id) {
           setSelectedSub({ ...selectedSub, status: newStatus as any });
         }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions(password);
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedSub) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSub]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-slate-100">
           <div className="w-14 h-14 bg-primary-blue/10 text-primary-blue rounded-2xl flex items-center justify-center mb-6">
             <Lock size={26} />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h1>
           <p className="text-slate-500 mb-8 text-sm">Please enter the security passkey to access the unified submission dashboard.</p>
           <form onSubmit={handleLogin}>
             <input
               type="password"
               value={password}
               onChange={e => setPassword(e.target.value)}
               className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-colors mb-4"
               placeholder="Enter passkey..."
               required
             />
             {authError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded-lg">{authError}</p>}
             <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition shadow-md disabled:opacity-70">
               {loading ? 'Verifying...' : 'Access Dashboard'}
             </button>
           </form>
        </div>
      </div>
    );
  }

  const filteredSubmissions = submissions.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.position?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.domain?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-primary text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
               <span className="font-bold text-sm tracking-widest">VI</span>
             </div>
             <h1 className="font-bold text-slate-900 text-lg hidden sm:block truncate">Unified Submissions</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input
                 type="text"
                 placeholder="Search names, emails..."
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue/30 w-72 transition-all"
               />
             </div>
             <button onClick={() => fetchSubmissions(password)} className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
               <RefreshCw size={20} className={loading ? "animate-spin text-primary-blue" : ""} />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'all', label: 'All Submissions', icon: <CheckCircle size={18} /> },
              { id: 'contact', label: 'Contact Messages', icon: <Mail size={18} /> },
              { id: 'career', label: 'Careers', icon: <Briefcase size={18} /> },
              { id: 'internship', label: 'Internships', icon: <GraduationCap size={18} /> },
              { id: 'jobs', label: 'Manage Jobs', icon: <Settings size={18} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-5 py-4 lg:py-3.5 rounded-2xl lg:rounded-xl font-bold lg:font-medium text-sm transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white lg:bg-transparent border border-slate-100 lg:border-transparent text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}`}
              >
                <span className={`${activeTab === tab.id ? 'text-primary-blue' : 'text-slate-400'}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        {activeTab === 'jobs' ? (
          <JobsManager password={password} />
        ) : (
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
           {/* Mobile Search */}
           <div className="p-4 border-b border-slate-100 md:hidden">
              <div className="relative">
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input
                   type="text"
                   placeholder="Search..."
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none"
                 />
               </div>
           </div>

            {loading && submissions.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw size={32} className="animate-spin mb-4 text-slate-300" />
                <p>Loading database records...</p>
             </div>
            ) : submissions.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-20">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                 <Search size={24} />
               </div>
               <p className="font-medium text-slate-700 mb-1">No Submissions Found</p>
               <p className="text-sm">There are no records in this category yet.</p>
             </div>
            ) : (
             <div className="relative flex-1 group/table">
               {/* Mobile Scroll Indicator */}
               <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 opacity-0 group-hover/table:opacity-100 lg:hidden transition-opacity" />
               <div className="overflow-x-auto flex-1 scrollbar-thin">
                 <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-[800px]">
                 <thead>
                   <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                     <th className="px-6 py-4 font-semibold rounded-tl-3xl">Candidate / User</th>
                     <th className="px-6 py-4 font-semibold">Type</th>
                     <th className="px-6 py-4 font-semibold">Role / Pos</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                     <th className="px-6 py-4 font-semibold">Date</th>
                     <th className="px-6 py-4 font-semibold text-right rounded-tr-3xl">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {filteredSubmissions.map(sub => (
                     <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group" onClick={() => setSelectedSub(sub)}>
                       <td className="px-6 py-4">
                         <p className="font-bold text-slate-900 mb-0.5">{sub.name}</p>
                         <p className="text-xs text-slate-500 font-medium">{sub.email}</p>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${sub.type === 'contact' ? 'bg-purple-100 text-purple-700' : sub.type === 'career' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                           {sub.type}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700 line-clamp-1">{sub.position || sub.domain || '—'}</p>
                       </td>
                       <td className="px-6 py-4">
                         <StatusBadge status={sub.status} />
                       </td>
                       <td className="px-6 py-4 text-sm font-medium text-slate-500">
                         {new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button className="text-slate-400 group-hover:text-primary-blue bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm hover:shadow-md transition-all" onClick={(e) => { e.stopPropagation(); setSelectedSub(sub); }}>
                           <Eye size={18} />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
          )}
        </div>
        )}
      </main>      {/* Detail Modal Layer */}
      <AnimatePresence mode="wait">
        {selectedSub && (
          <div className="fixed inset-0 z-[99999] flex items-stretch md:items-center justify-end md:p-6 isolate pointer-events-none">
            {/* Backdrop with Fade */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto"
              onClick={() => setSelectedSub(null)}
            />
            
            {/* Side Panel Modal */}
            <motion.div 
              initial={{ x: '100%', opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="relative bg-white w-full sm:w-[500px] h-[100dvh] md:h-auto md:max-h-[85vh] md:rounded-[32px] shadow-2xl flex flex-col z-[100000] overflow-hidden border-l md:border border-slate-100 pointer-events-auto"
            >
              {/* Responsive Header */}
              <div className="p-6 md:p-8 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-start justify-between sticky top-0 z-[110]">
                <div className="space-y-2 truncate flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedSub.type === 'contact' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {selectedSub.type}
                     </span>
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider tabular-nums">
                       {new Date(selectedSub.createdAt).toLocaleString()}
                     </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight truncate">{selectedSub.name}</h2>
                </div>
                
                {/* Robust Close Button */}
                <button 
                  onClick={() => setSelectedSub(null)} 
                  className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-900 hover:bg-slate-100 hover:text-red-500 rounded-full shadow-sm hover:shadow-md transition-all active:scale-90"
                  aria-label="Close"
                >
                  <XCircle size={32} strokeWidth={1.5} />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8 scrollbar-hide">
                {/* Contact Section */}
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Profile</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="group bg-slate-50 p-4 rounded-2xl border border-slate-100/50 hover:border-primary-blue/30 transition-colors flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-primary-blue">
                         <Mail size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                        <a href={`mailto:${selectedSub.email}`} className="text-sm text-slate-900 font-extrabold truncate block hover:underline">{selectedSub.email}</a>
                      </div>
                    </div>
                    {selectedSub.phone && (
                       <div className="group bg-slate-50 p-4 rounded-2xl border border-slate-100/50 hover:border-primary-blue/30 transition-colors flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-primary-blue text-sm font-black">
                             #
                          </div>
                         <div className="overflow-hidden">
                           <p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p>
                           <a href={`tel:${selectedSub.phone}`} className="text-sm text-slate-900 font-extrabold truncate block hover:underline">{selectedSub.phone}</a>
                         </div>
                       </div>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Message / Application</h4>
                  <div className="space-y-4">
                    {/* Position/Header Context */}
                    {(selectedSub.position || selectedSub.domain) && (
                       <div className="bg-slate-900 p-5 rounded-2xl text-white shadow-xl shadow-slate-900/10 mb-4">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Applying for</p>
                          <p className="font-extrabold text-lg md:text-xl leading-tight">{selectedSub.position || selectedSub.domain}</p>
                       </div>
                    )}
                    
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {selectedSub.message || 'No additional message provided.'}
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3">
                         {selectedSub.internshipType && (
                           <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                             <p className="text-[9px] text-amber-600 font-black uppercase mb-1 tracking-wider">Internship</p>
                             <p className="font-bold text-amber-900 text-[11px] leading-tight">{selectedSub.internshipType}</p>
                           </div>
                         )}
                         {selectedSub.duration && (
                           <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                             <p className="text-[9px] text-indigo-600 font-black uppercase mb-1 tracking-wider">Duration</p>
                             <p className="font-bold text-indigo-900 text-[11px] leading-tight">{selectedSub.duration}</p>
                           </div>
                         )}
                    </div>

                    {selectedSub.resume && (
                      <a href={selectedSub.resume} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4.5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest">
                        <Download size={18} /> View Resume Portfolio
                      </a>
                    )}
                  </div>
                </section>

                {/* Status Selection */}
                <section className="pt-6 border-t border-slate-100 pb-12">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Decision Pipeline</h4>
                  <div className="grid grid-cols-2 gap-3">
                      {['new', 'reviewed', 'shortlisted', 'rejected'].map(st => (
                        <button
                          key={st}
                          onClick={() => updateStatus(selectedSub.id, st)}
                          className={`px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border-2 ${selectedSub.status === st ? 'bg-primary-blue text-white border-primary-blue shadow-lg shadow-primary-blue/20' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                        >
                          {st === 'new' ? 'Pending' : st}
                        </button>
                      ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    new: 'bg-amber-100 text-amber-700',
    reviewed: 'bg-blue-100 text-blue-700',
    shortlisted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700'
  };
  const cls = map[status] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cls}`}>
       {status}
    </span>
  );
}

