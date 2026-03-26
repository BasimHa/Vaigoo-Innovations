"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Calendar, Video, Clock, CheckCircle2 } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/components/animations/variants';

export default function StatusCheckerPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Use the existing submissions API with email parameter
      const res = await fetch(`/api/submissions?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer admin123` // Dummy auth for status check proxy
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setResults(data.data || []);
        if (data.data?.length === 0) {
          setError('No applications found for this email address.');
        }
      } else {
        setError('Failed to fetch status. Please try again later.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Track Your <span className="text-gradient-primary">Application</span></h1>
        <p className="text-lg text-slate-600">Enter your email address to check the real-time status of your request.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto mb-16">
        <form onSubmit={handleCheck} className="relative">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            required
            className="w-full pl-6 pr-32 py-4 rounded-2xl bg-white border border-slate-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition-all text-slate-900"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Check
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500 font-medium text-sm">{error}</p>}
      </motion.div>

      <AnimatePresence>
        {results && results.length > 0 && (
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-2 px-2">Application History</h2>
            {results.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeUp}
                className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500">{item.type}</span>
                       <StatusBadge status={item.status} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-slate-500 text-sm">Application for {item.name || 'General Inquiry'}</p>
                  </div>

                  {item.status === 'Shortlisted' && item.interviewDate && (
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 md:max-w-xs w-full">
                       <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-3">
                         <Calendar size={16} /> Interview Scheduled
                       </div>
                       <div className="space-y-2">
                         <div className="flex items-center gap-2 text-slate-700 text-sm">
                           <Clock size={14} className="text-slate-400" />
                           {item.interviewDate}
                         </div>
                         {item.meetLink && (
                           <a 
                            href={item.meetLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary-blue font-bold text-sm hover:underline"
                           >
                             <Video size={14} /> Join Google Meet
                           </a>
                         )}
                       </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    Pending: 'bg-amber-100 text-amber-700',
    Reviewed: 'bg-blue-100 text-blue-700',
    Shortlisted: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-rose-100 text-rose-700'
  };
  const cls = map[status] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cls}`}>
       {status}
    </span>
  );
}
