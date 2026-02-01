
import { Project, TaskStatus, Priority, ProjectStatus, ProjectHealth } from './types';

// Fix: Updated Project and Task properties to match types.ts interface (assignee -> assigneeId, owner -> ownerId)
// and added missing required fields (health, startDate, endDate).
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Apollo Re-launch',
    description: 'Modernizing the legacy flight control systems for high-altitude orbital testing.',
    progress: 65,
    status: ProjectStatus.ACTIVE,
    priority: Priority.HIGH,
    health: ProjectHealth.HEALTHY,
    startDate: '2024-01-10',
    endDate: '2024-12-31',
    ownerId: 'James Miller',
    createdAt: '2024-01-10T09:00:00Z',
    members: ['Alex Rivera', 'Sarah Chen', 'Mike Ross'],
    tasks: [
      {
        id: 't1',
        title: 'Backend API Optimization',
        description: 'Refactor Node.js endpoints for 30% faster latency.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        assigneeId: 'Alex Rivera',
        dueDate: '2024-06-15'
      },
      {
        id: 't2',
        title: 'User Interface Design',
        description: 'Design the new telemetry dashboard screens.',
        status: TaskStatus.DONE,
        priority: Priority.MEDIUM,
        assigneeId: 'Sarah Chen',
        dueDate: '2024-05-20'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Orbit Dashboard SDK',
    description: 'Public SDK for third-party integration with our project tracking APIs.',
    progress: 30,
    status: ProjectStatus.ACTIVE,
    priority: Priority.MEDIUM,
    health: ProjectHealth.HEALTHY,
    startDate: '2024-02-15',
    endDate: '2024-09-30',
    ownerId: 'James Miller',
    createdAt: '2024-02-15T10:30:00Z',
    members: ['John Doe', 'Emily Watson'],
    tasks: [
      {
        id: 't3',
        title: 'Documentation Draft',
        description: 'Write initial README and API endpoint docs.',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        assigneeId: 'John Doe',
        dueDate: '2024-07-01'
      }
    ]
  }
];

export const STATUS_COLORS = {
  [TaskStatus.TODO]: 'bg-slate-100 text-slate-700',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
  [TaskStatus.REVIEW]: 'bg-amber-100 text-amber-700',
  [TaskStatus.DONE]: 'bg-emerald-100 text-emerald-700'
};

export const PRIORITY_COLORS = {
  [Priority.LOW]: 'bg-green-100 text-green-700',
  [Priority.MEDIUM]: 'bg-orange-100 text-orange-700',
  [Priority.HIGH]: 'bg-red-100 text-red-700'
};
