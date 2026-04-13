import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, Project, Activity, Task, Note } from '../types';

interface AppState {
  user: User;
  courses: Course[];
  projects: Project[];
  activities: Activity[];
  isDeepWorkMode: boolean;
  searchQuery: string;
  language: 'it' | 'en';
  accentColor: string;
  setLanguage: (lang: 'it' | 'en') => void;
  setAccentColor: (color: string) => void;
  setSearchQuery: (query: string) => void;
  setDeepWorkMode: (val: boolean) => void;
  updateXP: (amount: number) => void;
  addActivity: (action: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  addTask: (projectId: string, task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: Task['status']) => void;
  addNote: (courseId: string, note: Omit<Note, 'id'>) => void;
  deleteNote: (courseId: string, noteId: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
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
  {
    id: 'c3',
    title: 'Cyber Security Fundamentals',
    instructor: 'Ing. Verdi',
    thumbnail: 'https://picsum.photos/seed/security/800/450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    progress: 45,
    notes: [],
  },
  {
    id: 'c4',
    title: 'Data Science con Python',
    instructor: 'Dott.ssa Rosa',
    thumbnail: 'https://picsum.photos/seed/datascience/800/450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    progress: 10,
    notes: [],
  },
  {
    id: 'c5',
    title: 'UI/UX Design Moderno',
    instructor: 'Arch. Grigio',
    thumbnail: 'https://picsum.photos/seed/design/800/450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    progress: 90,
    notes: [],
  },
  {
    id: 'c6',
    title: 'Blockchain & Smart Contracts',
    instructor: 'Prof. Oro',
    thumbnail: 'https://picsum.photos/seed/blockchain/800/450',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    progress: 5,
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
  {
    id: 'p2',
    title: 'Sviluppo App Mobile Edu',
    description: 'Creazione di un\'app per lo studio collaborativo.',
    startDate: '2024-02-15',
    endDate: '2024-08-15',
    members: ['1', '3', '4'],
    tasks: [
      { id: 't4', title: 'Wireframing', status: 'done', priority: 'high' },
      { id: 't5', title: 'Setup Firebase', status: 'todo', priority: 'medium' },
    ],
  },
  {
    id: 'p3',
    title: 'Analisi Dati Ambientali',
    description: 'Monitoraggio sensori IoT in tempo reale.',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    members: ['1', '5'],
    tasks: [
      { id: 't6', title: 'Raccolta Dati', status: 'in-progress', priority: 'high' },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'it' | 'en'>('it');
  const [accentColor, setAccentColor] = useState('#00D1FF');

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

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProjects(prev => [...prev, newProject]);
    addActivity(`ha creato il progetto "${project.title}"`);
    updateXP(100);
  };

  const addTask = (projectId: string, task: Omit<Task, 'id'>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: [...p.tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }]
        };
      }
      return p;
    }));
    addActivity(`ha aggiunto un task al progetto`);
    updateXP(20);
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: Task['status']) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t)
        };
      }
      return p;
    }));
    if (status === 'done') updateXP(50);
  };

  const addNote = (courseId: string, note: Omit<Note, 'id'>) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          notes: [...c.notes, { ...note, id: Math.random().toString(36).substr(2, 9) }]
        };
      }
      return c;
    }));
    updateXP(10);
  };

  const deleteNote = (courseId: string, noteId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          notes: c.notes.filter(n => n.id !== noteId)
        };
      }
      return c;
    }));
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, progress };
      }
      return c;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      courses, 
      projects, 
      activities, 
      isDeepWorkMode, 
      searchQuery,
      language,
      accentColor,
      setLanguage,
      setAccentColor,
      setSearchQuery,
      setDeepWorkMode,
      updateXP,
      addActivity,
      addProject,
      addTask,
      updateTaskStatus,
      addNote,
      deleteNote,
      updateCourseProgress
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
