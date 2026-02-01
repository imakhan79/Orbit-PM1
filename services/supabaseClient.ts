
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5b5BJg-Tk93k6LQW0R3_hQ_n5LPEsi-';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchProjectsWithMeta = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      tasks (*),
      sprints (*),
      epics (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }
  return data;
};

export const fetchTeamMembers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return [];
  return data;
};

// Fix: Implemented createProject as used in ProjectList.tsx
export const createProject = async (project: any) => {
  const { data, error } = await supabase.from('projects').insert([project]).select();
  return error ? null : data[0];
};

// Fix: Implemented deleteProject as used in ProjectList.tsx
export const deleteProject = async (id: string) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  return !error;
};

export const createProjectFromTemplate = async (template: Partial<any>) => {
  const { data, error } = await supabase.from('projects').insert([template]).select();
  return error ? null : data[0];
};

// Fix: Refined updateTaskStatus to properly handle object updates
export const updateTaskStatus = async (taskId: string, updates: any) => {
  const { error } = await supabase.from('tasks').update(updates).eq('id', taskId);
  return !error;
};

export const upsertSprint = async (sprint: any) => {
  const { data, error } = await supabase.from('sprints').upsert(sprint).select();
  return error ? null : data[0];
};
