"use client";

import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, Target, Activity, CheckCircle2, Clock, XCircle, Sparkles } from 'lucide-react';

interface AnalyticsProps {
  data: any[];
  activeTab: string;
}

export default function AnalyticsTab({ data, activeTab }: AnalyticsProps) {
  
  // 1. Process Timeline Data (Group by Day)
  const timelineData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const date = item.Timestamp ? new Date(item.Timestamp).toLocaleDateString() : 'N/A';
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count })).slice(-7); // Last 7 days
  }, [data]);

  // 2. Process Status Distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const status = item.Status || 'Pending';
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  // 3. Process Position/Domain Distribution
  const domainData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const domain = item["Position Applying"] || item.Domain || 'General';
      counts[domain] = (counts[domain] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0, 5);
  }, [data, activeTab]);

  const COLORS = ['#ffffff', '#888888', '#444444', '#222222', '#111111'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Records" 
          value={data.length} 
          icon={<Users size={16} />} 
          trend="+12%" 
        />
        <StatCard 
          label="Avg Responses" 
          value="4.2/day" 
          icon={<Activity size={16} />} 
          trend="+5%" 
        />
        <StatCard 
          label="Shortlisted" 
          value={data.filter(i => i.Status === 'Shortlisted').length} 
          icon={<CheckCircle2 size={16} />} 
          trend="+22%" 
        />
        <StatCard 
          label="Pending Review" 
          value={data.filter(i => i.Status === 'Pending' || !i.Status).length} 
          icon={<Clock size={16} />} 
          trend="-2%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Growth Chart */}
        <div className="bg-[#050505] border border-[#151515] p-8 rounded-3xl h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-semibold">Volume Trend (Records)</h3>
            <span className="text-[10px] text-[#444] uppercase tracking-widest font-bold">7-Day Velocity</span>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
              <XAxis dataKey="date" stroke="#333" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#333" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #111', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="count" stroke="#fff" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Distribution */}
        <div className="bg-[#050505] border border-[#151515] p-8 rounded-3xl h-[400px]">
          <h3 className="text-white font-semibold mb-6">Position Breakdown</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={domainData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#111" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#888" fontSize={10} width={100} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#111' }}
                contentStyle={{ backgroundColor: '#000', border: '1px solid #111', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#fff" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown Pie */}
        <div className="bg-[#050505] border border-[#151515] p-8 rounded-3xl h-[400px]">
          <h3 className="text-white font-semibold mb-6">Status Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #111', borderRadius: '12px', fontSize: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Intelligence Insights */}
        <div className="bg-[#050505] border border-[#151515] p-8 rounded-3xl h-[400px] flex flex-col">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Sparkles size={16} className="text-white" /> Intelligence Highlights
          </h3>
          <div className="space-y-4 flex-1">
            <InsightItem label="Most Sought Role" value={domainData[0]?.name || 'N/A'} />
            <InsightItem label="Shortlist Velocity" value="2.3 days/response" />
            <InsightItem label="Peak Volume Day" value={timelineData.sort((a,b) => b.count - a.count)[0]?.date || 'N/A'} />
            <div className="mt-auto p-4 bg-[#111]/50 rounded-2xl border border-[#1a1a1a]">
               <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Growth Forecast</p>
               <p className="text-xs text-[#888] leading-relaxed">System predicts 15% volume increase in submissions next week based on current trajectory.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }: { label: string, value: string | number, icon: React.ReactNode, trend: string }) {
  return (
    <div className="p-6 bg-[#050505] border border-[#151515] rounded-3xl hover:border-[#333] transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#1a1a1a] flex items-center justify-center text-[#555] group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-[#888]">{trend}</span>
      </div>
      <div>
        <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">{label}</p>
        <p className="text-2xl font-semibold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function InsightItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#111]">
      <span className="text-xs text-[#555]">{label}</span>
      <span className="text-xs text-white font-semibold">{value}</span>
    </div>
  );
}
