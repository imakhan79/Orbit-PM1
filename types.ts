
export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum ProjectStatus {
  ACTIVE = 'Active',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived'
}

export enum ProjectHealth {
  HEALTHY = 'Healthy',
  AT_RISK = 'At Risk',
  CRITICAL = 'Critical'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Epic {
  id: string;
  projectId: string;
  title: string;
  color: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  goal?: string;
}

export interface Subtask {
  id: string;
  title: string;
  isDone: boolean;
}

export interface TaskDependency {
  taskId: string;
  type: 'blocks' | 'blocked_by';
}

export interface Task {
  id: string;
  projectId?: string;
  epicId?: string;
  sprintId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  watcherIds?: string[];
  dueDate: string;
  startDate?: string;
  storyPoints?: number;
  subtasks?: Subtask[];
  dependencies?: TaskDependency[];
  labels?: string[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  capacityPerWeek: number; // in Story Points
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  priority: Priority;
  health: ProjectHealth;
  startDate: string;
  endDate: string;
  ownerId: string;
  members: string[];
  tasks?: Task[];
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
