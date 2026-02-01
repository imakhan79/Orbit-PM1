
import React from 'react';
import { User, Project } from '../types';

interface ResourceProps {
  users: User[];
  projects: Project[];
}

const ResourceWorkload: React.FC<ResourceProps> = ({ users, projects }) => {
  // Mock data calculation
  const getUserWorkload = (userId: string) => Math.floor(Math.random() * 40); // Story points assigned

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Management</h2>
        <p className="text-slate-500 text-sm">Visualize team capacity and prevent burnout with intelligent workload tracking.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Active Capacity Plan</h3>
            <div className="space-y-6">
              {users.map(user => {
                const points = getUserWorkload(user.id);
                const capacity = user.capacityPerWeek || 30;
                const percentage = (points / capacity) * 100;
                const isOverbooked = percentage > 100;

                return (
                  <div key={user.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar || `https://picsum.photos/seed/${user.id}/40/40`} className="w-10 h-10 rounded-xl" alt={user.name} />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                          <div className="flex gap-1 mt-1">
                            {user.skills?.map(skill => (
                              <span key={skill} className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isOverbooked ? 'text-red-500' : 'text-slate-700'}`}>
                          {points} / {capacity} pts
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{isOverbooked ? 'Overbooked' : 'Available'}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isOverbooked ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                      {isOverbooked && (
                        <div 
                          className="h-full bg-red-800/30 absolute top-0 left-0"
                          style={{ width: `${percentage - 100}%`, left: '100%' }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Capacity Advisor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Sarah and Alex are currently at 120% capacity. Orbit AI suggests reassigning "Telemetry UI Refactor" to Mike Ross to balance the sprint workload.
            </p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all">
              Auto-Balance Sprint
            </button>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Leave Calendar</h4>
            <div className="space-y-3">
              {[
                { name: 'Sarah Chen', type: 'Holiday', date: 'Jul 12-15' },
                { name: 'Alex Rivera', type: 'Sick Leave', date: 'Today' }
              ].map((l, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${l.type === 'Holiday' ? 'bg-blue-400' : 'bg-amber-400'}`} />
                    <span className="font-bold text-slate-700">{l.name}</span>
                  </div>
                  <span className="text-slate-400">{l.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceWorkload;
