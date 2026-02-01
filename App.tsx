
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import GeminiAssistant from './components/GeminiAssistant';
import { SAMPLE_PROJECTS } from './constants';
import { fetchProjectsWithTasks } from './services/supabaseClient';
import { Project } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchProjectsWithTasks();
      if (data) {
        setProjects(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Synchronizing with Supabase...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard projects={projects} />;
      case 'tasks':
        return <KanbanBoard project={projects[0]} />;
      case 'projects':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {projects.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">View Details →</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{p.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{p.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${p.progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'team':
        return (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {['Alex Rivera', 'Sarah Chen', 'Mike Ross', 'Emily Watson'].map((member, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/${member}/32/32`} className="w-8 h-8 rounded-full" alt={member} />
                      <span className="font-medium text-slate-800">{member}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{i % 2 === 0 ? 'Lead Developer' : 'Product Designer'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{Math.floor(Math.random() * 10) + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <Dashboard projects={projects} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-96">
            <span className="absolute left-4 top-2.5 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search projects, tasks, team..." 
              className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">James Miller</p>
                <p className="text-xs text-slate-500">Project Manager</p>
              </div>
              <img src="https://picsum.photos/40/40?grayscale" className="w-10 h-10 rounded-xl border border-slate-200" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="pb-12">
          {renderContent()}
        </div>
      </main>

      <GeminiAssistant context={`Currently viewing ${activeTab} with ${projects.length} active projects and live Supabase synchronization.`} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
