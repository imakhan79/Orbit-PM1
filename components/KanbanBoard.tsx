
import React, { useState } from 'react';
import { Project, Task, TaskStatus } from '../types';
import { PRIORITY_COLORS } from '../constants';
import { updateTaskStatus } from '../services/supabaseClient';

interface KanbanBoardProps {
  project: Project;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ project }) => {
  const [tasks, setTasks] = useState<Task[]>(project.tasks || []);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const columns = [
    { id: TaskStatus.TODO, label: 'To Do' },
    { id: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { id: TaskStatus.REVIEW, label: 'Review' },
    { id: TaskStatus.DONE, label: 'Done' }
  ];

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setIsUpdating(taskId);
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    // Fix: Passing an object { status: newStatus } to match the required Partial update structure
    const success = await updateTaskStatus(taskId, { status: newStatus });
    if (!success) {
      setTasks(previousTasks); // Rollback on failure
      alert('Failed to update task on Supabase.');
    }
    setIsUpdating(null);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{project.name}</h2>
          <p className="text-sm text-slate-500">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {project.members.map((m, i) => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/${m}/32/32`} 
                className="w-8 h-8 rounded-full border-2 border-white" 
                title={m}
                alt={m}
              />
            ))}
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            + New Task
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-6">
        {columns.map(col => (
          <div key={col.id} className="w-80 flex-shrink-0 flex flex-col">
            <div className="flex items-center justify-between px-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">{col.label}</span>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {getTasksByStatus(col.id).length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-100/50 rounded-xl p-3 flex-1 space-y-3 min-h-[400px]">
              {getTasksByStatus(col.id).map(task => (
                <div 
                  key={task.id} 
                  className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 transition-all group cursor-default ${isUpdating === task.id ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                    <div className="relative group/menu">
                      <button className="text-slate-400 hover:text-blue-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover/menu:block z-10 overflow-hidden">
                        {columns.filter(c => c.id !== task.status).map(targetCol => (
                          <button
                            key={targetCol.id}
                            onClick={() => handleStatusChange(task.id, targetCol.id)}
                            className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            Move to {targetCol.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-800 leading-tight mb-1">{task.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-medium">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    {/* Fix: Changed task.assignee to task.assigneeId to match the Task interface */}
                    <img 
                      src={`https://picsum.photos/seed/${task.assigneeId}/24/24`} 
                      className="w-6 h-6 rounded-full" 
                      title={task.assigneeId}
                      alt={task.assigneeId}
                    />
                  </div>
                </div>
              ))}
              
              <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:border-slate-300 hover:text-slate-500 transition-all">
                + Add Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
