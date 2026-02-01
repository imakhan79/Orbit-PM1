
import React, { useState, useMemo } from 'react';
import { Project, ProjectHealth, ProjectStatus, TaskStatus } from '../types';
import { generatePortfolioAudit } from '../services/geminiService';

interface PortfolioProps {
  projects: Project[];
}

const PortfolioView: React.FC<PortfolioProps> = ({ projects }) => {
  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  // Derived Stats
  const stats = useMemo(() => {
    const critical = projects.filter(p => p.health === ProjectHealth.CRITICAL).length;
    const avgProgress = projects.length ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0;
    const healthy = projects.filter(p => p.health === ProjectHealth.HEALTHY).length;
    return { critical, avgProgress, healthy, total: projects.length };
  }, [projects]);

  // Filtering Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.ownerId.toLowerCase().includes(search.toLowerCase());
      const matchesHealth = healthFilter === 'All' || p.health === healthFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesHealth && matchesStatus;
    });
  }, [projects, search, healthFilter, statusFilter]);

  const getHealthColor = (health: ProjectHealth) => {
    switch (health) {
      case ProjectHealth.HEALTHY: return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case ProjectHealth.AT_RISK: return 'text-amber-500 bg-amber-50 border-amber-100';
      case ProjectHealth.CRITICAL: return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const handleAudit = async () => {
    setIsAuditing(true);
    const result = await generatePortfolioAudit(projects);
    setAuditResult(result);
    setIsAuditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative pb-20">
      {/* Portfolio Analytics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Active</p>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Critical Health</p>
          <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Healthy</p>
          <p className="text-2xl font-bold text-emerald-500">{stats.healthy}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Progress</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-blue-600">{stats.avgProgress}%</p>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${stats.avgProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Portfolio Governance</h2>
          <p className="text-slate-500 text-sm">Cross-functional view of all organizational workstreams.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search projects or owners..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-64"
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select 
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl outline-none"
          >
            <option value="All">All Health</option>
            {Object.values(ProjectHealth).map(h => <option key={h} value={h}>{h}</option>)}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl outline-none"
          >
            <option value="All">All Status</option>
            {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button 
            onClick={handleAudit}
            disabled={isAuditing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isAuditing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isAuditing ? (
              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
            Portfolio Auditor
          </button>
        </div>
      </header>

      {/* AI Audit Result Banner */}
      {auditResult && (
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl animate-fadeIn relative group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-sm mb-1">Executive Portfolio Audit</h3>
              <p className="text-blue-800 text-xs leading-relaxed whitespace-pre-wrap">{auditResult}</p>
            </div>
          </div>
          <button 
            onClick={() => setAuditResult(null)}
            className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Portfolio Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Health</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map(p => (
                <tr 
                  key={p.id} 
                  onClick={() => setSelectedProject(p)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">{p.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1.5 font-bold tracking-tight">Owner: {p.ownerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-tighter ${getHealthColor(p.health)}`}>
                        {p.health}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tighter">
                        {p.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-32">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                        <span>{p.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${p.health === ProjectHealth.CRITICAL ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[10px] font-bold text-slate-500">
                      <p>{new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-slate-300 my-0.5">↓</p>
                      <p>{new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex -space-x-2 justify-end">
                      {p.members.slice(0, 3).map((m, i) => (
                        <img key={i} src={`https://picsum.photos/seed/${m}/24/24`} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" alt={m} />
                      ))}
                      {p.members.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                          +{p.members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No projects found matching your filters.</p>
            <button 
              onClick={() => { setSearch(''); setHealthFilter('All'); setStatusFilter('All'); }}
              className="mt-4 text-blue-600 font-bold text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Project Detail Sidepanel */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex justify-end pointer-events-none">
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] pointer-events-auto"
            onClick={() => setSelectedProject(null)}
          />
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 pointer-events-auto flex flex-col animate-slideInRight">
            <header className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  {selectedProject.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedProject.name}</h3>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Project ID: {selectedProject.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">About Project</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.description}</p>
              </section>

              <section className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Health</p>
                  <p className={`text-sm font-bold ${getHealthColor(selectedProject.health).split(' ')[0]}`}>
                    {selectedProject.health}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-slate-700">{selectedProject.status}</p>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Task Breakdown</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Completed', count: selectedProject.tasks?.filter(t => t.status === TaskStatus.DONE).length || 0, color: 'bg-emerald-500' },
                    { label: 'In Progress', count: selectedProject.tasks?.filter(t => t.status === TaskStatus.IN_PROGRESS).length || 0, color: 'bg-blue-500' },
                    { label: 'To Do', count: selectedProject.tasks?.filter(t => [TaskStatus.TODO, TaskStatus.BACKLOG].includes(t.status)).length || 0, color: 'bg-slate-400' }
                  ].map(item => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>{item.label}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color}`} 
                          style={{ width: `${(item.count / (selectedProject.tasks?.length || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Team Composition</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.members.map(m => (
                    <div key={m} className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1.5 rounded-xl shadow-sm">
                      <img src={`https://picsum.photos/seed/${m}/20/20`} className="w-5 h-5 rounded-full" alt={m} />
                      <span className="text-xs font-bold text-slate-700">{m}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <footer className="p-6 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button className="py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
                View Reports
              </button>
              <button className="py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                Go to Project
              </button>
            </footer>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default PortfolioView;
