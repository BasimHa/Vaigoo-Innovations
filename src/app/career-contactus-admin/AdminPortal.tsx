"use client";

import { useState, useEffect } from 'react';
import { Search, RefreshCw, Mail, Briefcase, GraduationCap, Clock, CheckCircle2, XCircle, Lock, LayoutDashboard, Calendar, Video, ChevronRight, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type TabType = 'contact' | 'career' | 'internship';

export default function AdminPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [token, setToken] = useState('');

  const [activeTab, setActiveTab] = useState<TabType>('career');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSub, setSelectedSub] = useState<any | null>(null);

  // Shortlist Modal State
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [shortlistTarget, setShortlistTarget] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [postingStatus, setPostingStatus] = useState(false);

  const fetchSubmissions = async (sessionToken: string, tab: TabType) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`/api/admin-dashboard?type=${tab}`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
      const result = await res.json();

      if (res.ok) {
        setSubmissions(result.data || []);
        setIsAuthenticated(true);
        setToken(sessionToken);
      } else {
        setAuthError(result.error || 'Access Denied');
        if (res.status === 401) setIsAuthenticated(false);
      }
    } catch (e) {
      setAuthError('Network error connecting to dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    if (!supabase) {
      setAuthError('Authentication Error: Supabase configuration is missing. Please add your environment variables.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        fetchSubmissions(data.session.access_token, activeTab);
      }
    } catch (err) {
      setAuthError('An unexpected error occurred during login');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setIsAuthenticated(false);
    setToken('');
    setPassword('');
    setEmail('');
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchSubmissions(token, activeTab);
      setSelectedSub(null);
    }
  }, [activeTab]);

  const updateStatus = async (email: string, newStatus: string, modalDate?: string, modalLink?: string) => {
    setPostingStatus(true);
    try {
      const res = await fetch('/api/admin-dashboard', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: activeTab,
          email,
          status: newStatus,
          interviewDate: modalDate || null,
          meetLink: modalLink || null
        })
      });
      const data = await res.json();
      if (res.ok) {
        // Update local state instantly to reflect UI
        setSubmissions(prev => prev.map(s => s.Email === email ? { ...s, Status: newStatus } : s));
        if (selectedSub?.Email === email) {
          setSelectedSub({ ...selectedSub, Status: newStatus });
        }
        setShowShortlistModal(false);
      } else {
        alert("Failed to update status: " + (data.error || "Unknown"));
      }
    } catch (e) {
      alert("Network err updating status");
    } finally {
      setPostingStatus(false);
    }
  };

  const handleStatusChangeClick = (sub: any, newStatus: string) => {
    if (newStatus === 'Shortlisted') {
      setShortlistTarget(sub);
      setInterviewDate('');
      setMeetLink('');
      setShowShortlistModal(true);
    } else {
      updateStatus(sub.Email, newStatus);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-10 rounded-3xl shadow-2xl max-w-sm w-full">
          <div className="w-16 h-16 bg-[#111111] border border-[#222222] text-white rounded-2xl flex items-center justify-center mb-6">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">System Admin</h1>
          <p className="text-[#666666] mb-8 text-sm leading-relaxed">Secure environment. Authentic workspace credentials required.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#111111] border border-[#222222] text-white focus:outline-none focus:border-[#444444] transition-colors placeholder-[#555555]"
              placeholder="Official Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#111111] border border-[#222222] text-white focus:outline-none focus:border-[#444444] transition-colors placeholder-[#555555]"
              placeholder="Enter passkey"
              required
            />
            {authError && <p className="text-red-400 text-xs">{authError}</p>}
            <button type="submit" disabled={loading} className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredSubmissions = submissions.filter(s => {
    const term = searchQuery.toLowerCase();
    return (s.Name?.toLowerCase().includes(term) || s.Email?.toLowerCase().includes(term));
  }).reverse(); // Most recent first (assuming sheet appends to bottom)

  return (
    <div className="min-h-screen bg-[#000000] text-[#a1a1aa] flex font-sans selection:bg-[#333333] selection:text-white relative">

      {/* Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-[#151515] flex flex-col shrink-0 h-screen sticky top-0 hidden md:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center">
            <span className="font-bold text-[12px] tracking-tighter">VI</span>
          </div>
          <span className="text-white font-semibold tracking-tight text-sm">Dashboard</span>
        </div>
        <div className="px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-[#444444] uppercase tracking-widest mb-3 mt-4">Modules</p>
          {[
            { id: 'career', label: 'Careers', icon: <Briefcase size={16} /> },
            { id: 'internship', label: 'Internships', icon: <GraduationCap size={16} /> },
            { id: 'contact', label: 'Contacts', icon: <Mail size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id ? 'bg-[#151515] text-white border border-[#222222]' : 'text-[#888888] hover:text-white hover:bg-[#0a0a0a] border border-transparent'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-auto px-4 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-[80px] border-b border-[#151515] bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white tracking-tight capitalize">{activeTab} Entries</h2>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-2 py-1 bg-[#111111] border border-[#222222] rounded-md text-[#888888]">
              {submissions.length} Total Records
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-sm focus:outline-none focus:border-[#333333] text-white w-64 transition-all placeholder-[#444444]"
              />
            </div>
            <button onClick={() => fetchSubmissions(password, activeTab)} className="w-9 h-9 flex items-center justify-center bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] rounded-lg text-white transition-all">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* Data Table Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          {loading && submissions.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-[#555555] gap-3">
              <RefreshCw size={20} className="animate-spin" /> Loading real-time data from Sheets...
            </div>
          ) : submissions.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#555555]">
              <LayoutDashboard size={40} className="mb-4 text-[#222]" />
              <p>No records found for this module.</p>
            </div>
          ) : (
            <div className="bg-[#050505] border border-[#151515] rounded-2xl overflow-hidden w-full max-w-[1400px]">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead className="bg-[#0a0a0a] text-[#666666] border-b border-[#151515]">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-tight">Applicant</th>
                    {activeTab === 'career' && <th className="px-6 py-4 font-medium tracking-tight">Position</th>}
                    {activeTab === 'internship' && <th className="px-6 py-4 font-medium tracking-tight">Domain / Duration</th>}
                    <th className="px-6 py-4 font-medium tracking-tight">Contact</th>
                    {activeTab !== 'contact' && <th className="px-6 py-4 font-medium tracking-tight">Status</th>}
                    <th className="px-6 py-4 font-medium tracking-tight text-right text-xs uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151515]">
                  {filteredSubmissions.map(sub => (
                    <tr key={sub._rowIndex || Math.random()} className="hover:bg-[#0a0a0a]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white tracking-tight leading-tight">{sub.Name || 'Unknown'}</p>
                        <p className="text-xs text-[#666666] mt-0.5">{sub.Timestamp ? new Date(sub.Timestamp).toLocaleDateString() : 'N/A'}</p>
                      </td>
                      {activeTab === 'career' && (
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-[#111111] border border-[#222222] text-[#aaaaaa] rounded-md text-xs">{sub["Position Applying"] || 'General'}</span>
                        </td>
                      )}
                      {activeTab === 'internship' && (
                        <td className="px-6 py-4">
                          <p className="text-[#cccccc]">{sub.Domain || 'General'}</p>
                          <p className="text-xs text-[#666666] mt-0.5">{sub.Duration || 'N/A'}</p>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <p className="text-[#a1a1aa] text-xs">{sub.Email}</p>
                        <p className="text-xs text-[#555555] mt-0.5">{sub.Phone}</p>
                      </td>
                      {activeTab !== 'contact' && (
                        <td className="px-6 py-4">
                          <StatusPill status={sub.Status} />
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="px-4 py-2 bg-[#111111] hover:bg-white hover:text-black border border-[#222222] text-white rounded-lg text-xs font-semibold transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Slide-over Detail Panel */}
      <AnimatePresence>
        {selectedSub && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSub(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-lg bg-[#050505] border-l border-[#1a1a1a] z-50 overflow-y-auto"
            >
              <div className="p-8 border-b border-[#1a1a1a] flex justify-between items-start sticky top-0 bg-[#050505]/90 backdrop-blur-md z-10">
                <div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight leading-none mb-2">{selectedSub.Name}</h3>
                  <a href={`mailto:${selectedSub.Email}`} className="text-[#888888] text-sm hover:text-white transition-colors">{selectedSub.Email}</a>
                </div>
                <button onClick={() => setSelectedSub(null)} className="p-2 bg-[#111] hover:bg-[#222] rounded-full text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Meta Attributes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                    <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Phone</p>
                    <p className="text-[#ececec] text-sm">{selectedSub.Phone || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                    <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Row Idx</p>
                    <p className="text-[#ececec] text-sm">#{selectedSub._rowIndex}</p>
                  </div>
                  {activeTab === 'career' && (
                    <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl col-span-2">
                      <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Applying For</p>
                      <p className="text-white font-semibold">{selectedSub["Position Applying"] || 'N/A'}</p>
                    </div>
                  )}
                  {activeTab === 'internship' && (
                    <>
                      <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                        <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Domain</p>
                        <p className="text-white font-semibold">{selectedSub.Domain || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                        <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Duration</p>
                        <p className="text-white font-semibold">{selectedSub.Duration || 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Message */}
                <div>
                  <h4 className="text-xs text-[#666] font-semibold mb-3 uppercase tracking-wider">Message / Cover Letter</h4>
                  <div className="p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-sm leading-relaxed text-[#cccccc] font-medium whitespace-pre-wrap">
                    {selectedSub.Message || 'No message attached.'}
                  </div>
                </div>

                {/* Resume Form */}
                {selectedSub["Resume Link"] && (
                  <a href={selectedSub["Resume Link"]} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-[#e5e5e5] transition-colors">
                    View Attached Resume
                  </a>
                )}

                {/* Interactive Status Controls */}
                {activeTab !== 'contact' && (
                  <div className="pt-8 border-t border-[#1a1a1a]">
                    <h4 className="text-xs text-[#666] font-semibold mb-4 uppercase tracking-wider">Application Decision</h4>
                    <p className="text-xs text-[#555] mb-4">* Changing status sends automated email to applicant (unless duplicate).</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['Pending', 'Reviewed', 'Shortlisted', 'Rejected'].map(st => (
                        <button
                          key={st}
                          disabled={postingStatus}
                          onClick={() => handleStatusChangeClick(selectedSub, st)}
                          className={`py-3 rounded-xl text-sm font-semibold border transition-all disabled:opacity-50 ${selectedSub.Status === st ? 'bg-[#151515] text-white border-[#333]' : 'bg-transparent text-[#666] border-[#1a1a1a] hover:border-[#444] hover:text-white'}`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shortlist Setup Modal */}
      <AnimatePresence>
        {showShortlistModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0a0a0a] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-[#222]">
                  <h3 className="text-xl font-semibold text-white">Setup Interview</h3>
                  <p className="text-sm text-[#888] mt-1">Provide meeting details for {shortlistTarget?.Name}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs text-[#666] font-semibold mb-2 uppercase">Scheduled Date/Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
                      <input
                        type="text"
                        value={interviewDate}
                        onChange={e => setInterviewDate(e.target.value)}
                        placeholder="e.g. Oct 25 at 10:00 AM"
                        className="w-full bg-[#111] border border-[#222] text-white pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#444]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] font-semibold mb-2 uppercase">Google Meet Link</label>
                    <div className="relative">
                      <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
                      <input
                        type="url"
                        value={meetLink}
                        onChange={e => setMeetLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="w-full bg-[#111] border border-[#222] text-white pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#444]"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#111] border-t border-[#222] flex gap-3">
                  <button onClick={() => setShowShortlistModal(false)} className="flex-1 py-3 text-[#666] font-semibold text-sm hover:bg-[#1a1a1a] rounded-lg">Cancel</button>
                  <button onClick={() => updateStatus(shortlistTarget.Email, 'Shortlisted', interviewDate, meetLink)} disabled={postingStatus} className="flex-1 py-3 bg-white text-black font-semibold text-sm rounded-lg hover:bg-[#e0e0e0] disabled:opacity-50">
                    {postingStatus ? 'Dispatching...' : 'Dispatch Email'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

function StatusPill({ status }: { status?: string }) {
  const normalized = (status || 'Pending').toLowerCase();

  const map: Record<string, string> = {
    pending: 'bg-[#ffed4a]/10 text-[#ffed4a] border-[#ffed4a]/20',
    reviewed: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
    shortlisted: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20',
    rejected: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20'
  };

  const cls = map[normalized] || 'bg-white/5 text-white border-white/10';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {status || 'Pending'}
    </span>
  );
}
