export type UserRole = 'student' | 'researcher' | 'admin';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  xp: number;
  level: number;
  badges: Badge[];
  skills: {
    programming: number;
    design: number;
    research: number;
    communication: number;
    management: number;
  };
}

export interface Note {
  id: string;
  timestamp: number;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  videoUrl: string;
  progress: number;
  notes: Note[];
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  startDate: string;
  endDate: string;
  members: string[];
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}
