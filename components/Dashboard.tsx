
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Project } from '../types';
import { generateProjectSummary } from '../services/geminiService';

const data = [
  { name: 'Mon', tasks: 12 },
  { name: 'Tue', tasks: 19 },
  { name: 'Wed', tasks: 15 },
  { name: 'Thu', tasks: 22 },
  { name: 'Fri', tasks: 30 },
  { name: 'Sat', tasks: 25 },
  { name: 'Sun', tasks: 18 },
];

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const [summary, setSummary] = useState<string>('Generating project health summary...');
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (projects.length > 0) {
        setLoadingSummary(true);
        const res = await generateProjectSummary(projects[0].name, projects[0].tasks);
        setSummary(res || 'No summary available.');
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, [projects]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Workspace Overview</h2>
        <p className="text-slate-500">Track performance and team velocity across all projects.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: projects.length, change: '+2', color: 'blue' },
          { label: 'Tasks Completed', value: '142', change: '+12%', color: 'emerald' },
          { label: 'Team Members', value: '12', change: '0', color: 'purple' },
          { label: 'Avg. Velocity', value: '24 pts', change: '+3.4', color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Task Velocity</h3>
            <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold">Orbit AI Insights</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className={`p-4 rounded-xl border border-slate-700 bg-slate-800/50 ${loadingSummary ? 'animate-pulse' : ''}`}>
              <h4 className="text-xs font-semibold text-blue-400 uppercase mb-2">Live Project Health</h4>
              <p className="text-sm leading-relaxed text-slate-300 italic">
                {summary}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase mb-2">Team Sentiment</h4>
              <p className="text-sm text-slate-300">
                Team is performing above average this week. 85% of tasks reached "Review" status within 48 hours.
              </p>
            </div>
          </div>

          <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors">
            Ask for Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
