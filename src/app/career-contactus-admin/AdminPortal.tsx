"use client";

import { useState } from 'react';
import { Plus, Lock, LogOut } from 'lucide-react';
import JobsManager from './JobsManager';

export default function AdminPortal() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const PASSKEY = 'Basim123!';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    if (password !== PASSKEY) {
      setAuthError('Invalid passkey. Access denied.');
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-xl max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Lock size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight text-center">Admin Access</h1>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed text-center font-medium">Please enter the security passkey to access the dashboard.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-400 font-medium"
              placeholder="Enter passkey..."
              required
            />
            {authError && <p className="text-red-500 text-xs font-semibold text-center">{authError}</p>}
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

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
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all bg-[#151515] text-white border border-[#222222]">
            <Plus size={16} /> Job Postings
          </button>
          
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
            <h2 className="text-xl font-semibold text-white tracking-tight capitalize">Job Postings Manager</h2>
          </div>
        </header>

        {/* Data Table Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          <JobsManager password={PASSKEY} />
        </div>
      </main>

    </div>
  );
}
