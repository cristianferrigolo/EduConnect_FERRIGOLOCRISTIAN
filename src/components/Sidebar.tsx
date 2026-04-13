import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Timer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'courses', icon: BookOpen, label: 'Corsi' },
  { id: 'research', icon: Search, label: 'Ricerca' },
  { id: 'projects', icon: LayoutDashboard, label: 'Progetti' },
  { id: 'calendar', icon: Calendar, label: 'Calendario' },
  { id: 'pomodoro', icon: Timer, label: 'Produttività' },
  { id: 'admin', icon: ShieldCheck, label: 'Admin' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, signOut } = useAuth();

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen glass-panel border-r border-white/10 flex flex-col relative z-50"
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-vivid-purple flex items-center justify-center shadow-lg shadow-electric-blue/20">
          <BookOpen className="text-white" size={24} />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-xl font-bold gradient-text leading-none">EduConnect</span>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">{profile?.role || 'Studente'}</span>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative",
              activeTab === item.id 
                ? "bg-white/10 text-electric-blue" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={22} className={cn(
              "transition-transform duration-300 group-hover:scale-110",
              activeTab === item.id && "text-electric-blue"
            )} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
            )}
            {activeTab === item.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-electric-blue rounded-r-full"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-2">
        <button className="w-full flex items-center gap-4 p-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
          <Settings size={22} />
          {!isCollapsed && <span>Impostazioni</span>}
        </button>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={22} />
          {!isCollapsed && <span>Esci</span>}
        </button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-20 w-8 h-8 rounded-full glass-panel flex items-center justify-center border border-white/10 hover:border-electric-blue/50 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.div>
  );
};
