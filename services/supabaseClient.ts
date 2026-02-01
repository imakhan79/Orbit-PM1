
import { createClient } from '@supabase/supabase-js';

// The publishable key provided by the user is used as the anon key.
// We assume the URL is provided in the environment or follows standard project patterns.
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5b5BJg-Tk93k6LQW0R3_hQ_n5LPEsi-';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchProjectsWithTasks = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      tasks (*)
    `);
  
  if (error) {
    console.error('Error fetching Supabase data:', error);
    return null;
  }
  return data;
};

export const updateTaskStatus = async (taskId: string, newStatus: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', taskId);
    
  if (error) {
    console.error('Error updating task:', error);
    return false;
  }
  return true;
};
