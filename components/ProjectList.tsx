
import React, { useState } from 'react';
import { Project, ProjectStatus, Priority } from '../types';
import { generateProjectPlan } from '../services/geminiService';
import { createProject, deleteProject } from '../services/supabaseClient';

interface ProjectListProps {
  projects: Project[];
  onRefresh: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [aiInput, setAiInput] = useState('');

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsGenerating(true);
    const plan = await generateProjectPlan(aiInput);
    if (plan) {
      const newProject = await createProject({
        name: plan.name,
        description: plan.description,
        priority: plan.priority,
        status: ProjectStatus.ACTIVE,
        progress: 0,
        owner: 'James Miller',
        members: ['James Miller']
      });
      // In a real app, we would also create the initial tasks here.
      if (newProject) {
        setIsModalOpen(false);
        setAiInput('');
        onRefresh();
      }
    }
    setIsGenerating(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
          <p className="text-slate-500">Manage and initialize your workspace goals.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500/20"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                p.status === ProjectStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600' :
                p.status === ProjectStatus.ON_HOLD ? 'bg-amber-50 text-amber-600' :
                'bg-slate-50 text-slate-600'
              }`}>
                {p.status}
              </div>
              <button 
                onClick={(e) => handleDelete(p.id, e)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2">{p.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">{p.description}</p>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{p.tasks?.length || 0} Tasks</span>
                </div>
                <div className="flex -space-x-1.5">
                  {p.members?.slice(0, 3).map((m, i) => (
                    <img key={i} src={`https://picsum.photos/seed/${m}/24/24`} className="w-6 h-6 rounded-full border-2 border-white" alt={m} />
                  ))}
                  {(p.members?.length || 0) > 3 && (
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                      +{(p.members?.length || 0) - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${p.progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${p.progress}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No projects found matching the criteria.</p>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">New Project</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Initialize with AI</label>
                  <div className="relative">
                    <textarea 
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Describe your goal... (e.g., 'A 3-month launch plan for a SaaS startup')"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none h-32 text-sm"
                    />
                    <button 
                      onClick={handleAiGenerate}
                      disabled={isGenerating || !aiInput.trim()}
                      className="absolute right-3 bottom-3 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      Generate Plan
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Or</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <button className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                  Manual Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
