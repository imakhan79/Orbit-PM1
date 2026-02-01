
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasks: Task[];
  members: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
