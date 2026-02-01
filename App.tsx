
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import GeminiAssistant from './components/GeminiAssistant';
import ProjectList from './components/ProjectList';
import PortfolioView from './components/PortfolioView';
import ResourceWorkload from './components/ResourceWorkload';
import { fetchProjectsWithMeta, fetchTeamMembers } from './services/supabaseClient';
import { Project, User, ProjectHealth, Priority, ProjectStatus } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const projData = await fetchProjectsWithMeta();
    const userData = await fetchTeamMembers();
    
    // Fallback logic for mock users if DB is empty
    if (userData.length === 0) {
      setUsers([
        { id: 'u1', name: 'Sarah Chen', role: 'UX Lead', avatar: 'https://picsum.photos/seed/sarah/40/40', skills: ['Figma', 'React'], capacityPerWeek: 30 },
        { id: 'u2', name: 'Alex Rivera', role: 'Architect', avatar: 'https://picsum.photos/seed/alex/40/40', skills: ['Go', 'K8s'], capacityPerWeek: 40 },
        { id: 'u3', name: 'Mike Ross', role: 'Fullstack', avatar: 'https://picsum.photos/seed/mike/40/40', skills: ['Node', 'SQL'], capacityPerWeek: 35 }
      ]);
    } else {
      setUsers(userData);
    }

    if (projData) {
      setProjects(projData.map(p => ({
        ...p,
        health: p.health || ProjectHealth.HEALTHY,
        startDate: p.startDate || '2024-01-01',
        endDate: p.endDate || '2024-12-31'
      })));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Syncing Orbit Enterprise Core...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard projects={projects} />;
      case 'portfolio': return <PortfolioView projects={projects} />;
      case 'resources': return <ResourceWorkload users={users} projects={projects} />;
      case 'tasks': return projects.length > 0 ? <KanbanBoard project={projects[0]} /> : <div>No Projects</div>;
      case 'projects': return <ProjectList projects={projects} onRefresh={loadData} />;
      case 'team': return <ResourceWorkload users={users} projects={projects} />; 
      default: return <Dashboard projects={projects} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto w-full">
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-96">
            <span className="absolute left-4 top-2.5 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search everything..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={loadData}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm group"
              title="Refresh Data"
            >
              <svg className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">James Miller</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Portfolio Director</p>
              </div>
              <img src="https://picsum.photos/seed/admin/40/40?grayscale" className="w-11 h-11 rounded-xl border-2 border-white shadow-sm" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="pb-12">
          {renderContent()}
        </div>
      </main>

      <GeminiAssistant context={`Portfolio Governance view active. Current organizational health is ${projects.some(p => p.health === ProjectHealth.CRITICAL) ? 'Caution' : 'Optimal'}.`} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
