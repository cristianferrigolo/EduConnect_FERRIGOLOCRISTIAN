import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, Project, Activity } from '../types';

interface AppState {
  user: User;
  courses: Course[];
  projects: Project[];
  activities: Activity[];
  isDeepWorkMode: boolean;
  setDeepWorkMode: (val: boolean) => void;
  updateXP: (amount: number) => void;
  addActivity: (action: string) => void;
}

const DEFAULT_USER: User = {
  id: '1',
  name: 'Mario Rossi',
  email: 'mario.rossi@educonnect.it',
  role: 'student',
  xp: 1250,
  level: 5,
  badges: [
    { id: '1', name: 'Pioniere', icon: '🚀', unlockedAt: new Date().toISOString() },
    { id: '2', name: 'Codificatore', icon: '💻', unlockedAt: new Date().toISOString() },
  ],
  skills: {
    programming: 85,
    design: 60,
    research: 45,
    communication: 70,
    management: 30,
  },
};

const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Sviluppo Web Avanzato',
    instructor: 'Dott. Bianchi',
    thumbnail: 'https://picsum.photos/seed/web/800/450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    progress: 65,
    notes: [
      { id: 'n1', timestamp: 10, content: 'Ricordarsi di React Context' },
    ],
  },
  {
    id: 'c2',
    title: 'Intelligenza Artificiale 101',
    instructor: 'Prof. Neri',
    thumbnail: 'https://picsum.photos/seed/ai/800/450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    progress: 20,
    notes: [],
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Ricerca Quantum Computing',
    description: 'Analisi degli algoritmi di Shor e Grover.',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    members: ['1', '2'],
    tasks: [
      { id: 't1', title: 'Revisione Letteratura', status: 'done', priority: 'high' },
      { id: 't2', title: 'Simulazione Qiskit', status: 'in-progress', priority: 'medium' },
      { id: 't3', title: 'Stesura Report', status: 'todo', priority: 'low' },
    ],
  },
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('edu_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edu_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('edu_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isDeepWorkMode, setDeepWorkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('edu_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('edu_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edu_projects', JSON.stringify(projects));
  }, [projects]);

  const updateXP = (amount: number) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const addActivity = (action: string) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      user: user.name,
      action,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 20));
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      courses, 
      projects, 
      activities, 
      isDeepWorkMode, 
      setDeepWorkMode,
      updateXP,
      addActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
